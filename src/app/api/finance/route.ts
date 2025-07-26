import puppeteer from "puppeteer";
import { NextRequest, NextResponse } from "next/server";
import { googleCompanySymbol } from "@/utils/constant";
import LRU from "lru-cache";

type FinanceData = {
  peRatio?: string;
  eps?: string;
};

const cache = new LRU({
  max: 100, // Maximum number of items (required)
  ttl: 1000 * 60 * 3, // 5 minutes in ms (instead of maxAge)
});

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cacheKey = "stocks";

  if (cache.has(cacheKey)) {
    console.log("Cache hit");
    return NextResponse.json(cache.get(cacheKey));
  }

  const browser = await puppeteer.launch({ headless: true });

  const result: Record<string, FinanceData> = {};

  const companyEntries = Object.entries(googleCompanySymbol).flatMap(
    ([_, companies]) => Object.entries(companies)
  );

  // Limit concurrency if needed (e.g., max 5 tabs at once)
  const concurrency = 5;
  const chunks = Array.from(
    { length: Math.ceil(companyEntries.length / concurrency) },
    (_, i) =>
      companyEntries.slice(i * concurrency, i * concurrency + concurrency)
  );

  for (const chunk of chunks) {
    const promises = chunk.map(async ([company, symbol]) => {
      const url = `https://www.google.com/finance/quote/${symbol}`;
      console.log(`Fetching: ${company} -> ${url}`);

      const page = await browser.newPage();
      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
        await page.waitForSelector("div.P6K39c", { timeout: 5000 });

        const data: FinanceData = await page.evaluate(() => {
          const res: FinanceData = {};

          document.querySelectorAll("div.gyFHrc").forEach((div) => {
            const label = div.querySelector("div.mfs7Fc")?.textContent?.trim();
            const value = div.querySelector("div.P6K39c")?.textContent?.trim();
            if (label === "P/E ratio") res.peRatio = value;
          });

          document.querySelectorAll("tr.roXhBd").forEach((row) => {
            const label = row.querySelector("div.rsPbEe")?.textContent?.trim();
            const value = row.querySelector("td.QXDnM")?.textContent?.trim();
            if (label === "Earnings per share") res.eps = value;
          });

          return res;
        });

        result[company] = data;
      } catch (err) {
        console.error(`Error fetching ${company}:`, err);
        result[company] = { peRatio: "-", eps: "-" };
      } finally {
        await page.close();
      }
    });

    await Promise.all(promises);
  }

  await browser.close();

  cache.set(cacheKey, result);
  return NextResponse.json(result);
}
