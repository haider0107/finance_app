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

// export async function GET(
//   request: NextRequest,
//   { params }: { params: Promise<{ symbol: string }> }
// ) {
//   const { symbol } = await params;

//   try {
//     const result = await yahooFinance.quoteSummary(symbol, {
//       modules: ["price", "summaryDetail", "defaultKeyStatistics"],
//     });

//     const data = {
//       cmp: result.price?.regularMarketPrice,
//       currency: result.price?.currency,
//       peRatio: result.summaryDetail?.trailingPE,
//       eps: result.defaultKeyStatistics?.trailingEps,
//     };

//     return new Response(JSON.stringify(data), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (err) {
//     const error = err as Error;
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
// }

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
