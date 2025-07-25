"use client";

import StockCard from "@/components/StockCard";
import { useState } from "react";

type StockData = {
  name: string;
  purchasePrice: number;
  quantity: number;
  investment: number;
  portfolioPercent: number;
  exchange: "NSE" | "BSE";
  cmp: number; // <-- to update
  presentValue: number; // <-- to update
  gainLoss: number; // <-- to update
  peRatio: string;
  latestEarnings: string;
};

export default function Home() {
  const [stocks, setStocks] = useState<StockData[]>();

  return (
    <main style={{ padding: "16px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <StockCard symbol="AAPL" />
        <StockCard symbol="TSLA" />
        <StockCard symbol="INFY.NS" />
      </div>
    </main>
  );
}
