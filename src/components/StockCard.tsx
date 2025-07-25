"use client";
import { useEffect, useState } from "react";

type StockData = {
  cmp: number;
  currency: string;
  peRatio: number;
  eps: number;
};

export default function StockCard({ symbol }: { symbol: string }) {
  const [data, setData] = useState<StockData | null>(null);

  useEffect(() => {
    fetch(`/api/stocks/${symbol}`)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Failed to fetch stock data:", err));
  }, [symbol]);

  if (!data) return <div>Loading {symbol}...</div>;

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "12px", borderRadius: "6px" }}
    >
      <h3>{symbol}</h3>
      <p>
        Current Price: {data.cmp} {data.currency}
      </p>
      <p>P/E Ratio: {data.peRatio}</p>
      <p>EPS (TTM): {data.eps}</p>
    </div>
  );
}
