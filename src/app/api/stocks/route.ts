import { yahooCompanySymbol } from "@/utils/constant";
import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

type FinanceResponse = {
  [company: string]: {
    cmp: number;
    currency: string;
  };
};

function flattenCompanySymbols(obj: Record<string, Record<string, string>>) {
  const flat: Record<string, string> = {};
  for (const sector in obj) {
    Object.assign(flat, obj[sector]);
  }
  return flat;
}

const allCompanySymbols = flattenCompanySymbols(yahooCompanySymbol);

export async function GET(req: NextRequest) {
  const data: FinanceResponse = {};

  const symbols = Object.entries(allCompanySymbols);

  const chunks = Array.from({ length: Math.ceil(symbols.length / 5) }, (_, i) =>
    symbols.slice(i * 5, i * 5 + 5)
  );

  for (const chunk of chunks) {
    await Promise.all(
      chunk.map(async ([company, symbol]) => {
        try {
          const quote = await yahooFinance.quote(symbol);
          data[company] = {
            cmp: quote.regularMarketPrice || 0,
            currency: quote.currency || "INR",
          };
        } catch (err) {
          console.error(`Error fetching ${company}:`, err);
        }
      })
    );
  }

  return NextResponse.json(data);
}
