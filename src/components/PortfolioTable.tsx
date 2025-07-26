"use client";

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface Stock {
  particulars: string;
  symbol: string;
  exchange: string;
  purchasePrice: number;
  quantity: number;
  investment: number;
  CMP: number;
  presentValue: number;
  gainLoss: number;
  peRatio: number;
  latestEarnings: number;
  portfolioPercent: string;
}

interface PortfolioProps {
  data: Record<string, Stock[]>;
}

const PortfolioTable: React.FC<PortfolioProps> = ({ data }) => {
  return (
    <Box sx={{ padding: 4 }}>
      {/* <Typography variant="h4" gutterBottom>
        Portfolio Overview
      </Typography> */}

      {Object.entries(data).map(([sector, stocks]) => (
        <Box key={sector} sx={{ marginBottom: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 4, fontWeight: "bold" }}
          >
            {sector}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
            Total Investment: ₹
            {stocks
              .reduce((sum, s) => sum + Number(s.investment), 0)
              .toFixed(2)}{" "}
            | Total Portfolio :{" "}
            {stocks.reduce((sum, s) => sum + Number(s.portfolioPercent), 0)}
            %
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="portfolio table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#000" }}>
                  {[
                    "Particulars",
                    "Qty",
                    "NSE/BSE",
                    "Buy Price",
                    "CMP",
                    "Investment",
                    "Present Value",
                    "Gain/Loss",
                    "PE Ratio",
                    "EPS",
                    "% of Portfolio",
                  ].map((head, index) => (
                    <TableCell
                      key={index}
                      sx={{
                        fontWeight: "bold",
                        color: "white",
                        borderRight: "1px solid #444",
                      }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {stocks.map((stock, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                    }}
                  >
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {stock.particulars}
                    </TableCell>
                    <TableCell>{stock.quantity}</TableCell>
                    <TableCell>{stock.symbol}</TableCell>
                    <TableCell>₹{stock.purchasePrice}</TableCell>
                    <TableCell>₹{stock.CMP}</TableCell>
                    <TableCell>₹{stock.investment}</TableCell>
                    <TableCell>₹{stock.presentValue.toFixed(2)}</TableCell>
                    <TableCell
                      sx={{
                        color: stock.gainLoss >= 0 ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {stock.gainLoss.toFixed(2)}
                    </TableCell>
                    <TableCell>{stock.peRatio}</TableCell>
                    <TableCell>{stock.latestEarnings}</TableCell>
                    <TableCell>{stock.portfolioPercent}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Box>
  );
};

export default PortfolioTable;
