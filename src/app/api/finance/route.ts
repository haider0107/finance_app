import puppeteer from "puppeteer";
import { NextRequest, NextResponse } from "next/server";
import { googleCompanySymbol } from "@/utils/constant";

type FinanceData = {
  peRatio?: string;
  eps?: string;
};

// export async function GET(request: NextRequest) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   try {
//     const result: Record<string, FinanceData> = {};

//     for (const [_, companies] of Object.entries(googleCompanySymbol)) {
//       for (const [company, symbol] of Object.entries(companies)) {
//         const url = `https://www.google.com/finance/quote/${symbol}`;
//         console.log(`Fetching: ${company} -> ${url}`);

//         await page.goto(url, { waitUntil: "networkidle2" });
//         await page.waitForSelector("div.P6K39c", { timeout: 2000 });

//         const data: FinanceData = await page.evaluate(() => {
//           const res: FinanceData = {};

//           document.querySelectorAll("div.gyFHrc").forEach((div) => {
//             const label = div.querySelector("div.mfs7Fc")?.textContent?.trim();
//             const value = div.querySelector("div.P6K39c")?.textContent?.trim();
//             if (label === "P/E ratio") res.peRatio = value;
//           });

//           document.querySelectorAll("tr.roXhBd").forEach((row) => {
//             const label = row.querySelector("div.rsPbEe")?.textContent?.trim();
//             const value = row.querySelector("td.QXDnM")?.textContent?.trim();
//             if (label === "Earnings per share") res.eps = value;
//           });

//           return res;
//         });

//         result[company] = data;
//       }
//     }

//     return NextResponse.json(result);
//   } catch (err) {
//     await browser.close();
//     const error = err as Error;
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
// }

export async function GET(request: NextRequest) {
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
  return NextResponse.json(result);
}
