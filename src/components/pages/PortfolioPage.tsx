"use client";

import PortfolioTable from "@/components/PortfolioTable";
import ToastSnackbar from "@/components/ToastSnackbar";
import { initialPortfolioState } from "@/utils/constant";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState(initialPortfolioState);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message: string, severity: "success" | "error") => {
    setToast({ open: true, message, severity });
  };

  useEffect(() => {
    // Function to fetch CMP and update related fields
    const updateCMPData = async () => {
      try {
        const cmpRes = await fetch("/api/stocks").then((res) => res.json());

        const updatedPortfolio = { ...portfolio };

        for (const [sectorKey, stocks] of Object.entries(portfolio)) {
          const sector = sectorKey as keyof typeof initialPortfolioState;

          updatedPortfolio[sector] = stocks.map((stock) => {
            const cmpEntry = cmpRes[stock.particulars];
            const CMP = cmpEntry?.cmp ?? stock.CMP ?? 0;
            // const CMP = stock.CMP++;

            const presentValue = CMP * stock.quantity;
            const gainLoss = presentValue - stock.investment;

            return {
              ...stock,
              CMP,
              presentValue,
              gainLoss,
            };
          });
        }

        setPortfolio(updatedPortfolio);
      } catch (error) {
        console.error("Error updating CMP data:", error);
        showToast("Error updating CMP data", "error");
      }
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        const [cmpRes, financeRes] = await Promise.all([
          fetch("/api/stocks").then((res) => res.json()),
          fetch("/api/finance").then((res) => res.json()),
        ]);

        // Update all fields
        const updatedPortfolio = initialPortfolioState;

        for (const [sectorKey, stocks] of Object.entries(
          initialPortfolioState
        )) {
          const sector = sectorKey as keyof typeof initialPortfolioState;

          updatedPortfolio[sector] = stocks.map((stock) => {
            const cmpEntry = cmpRes[stock.particulars];
            const financeEntry = financeRes[stock.particulars];

            const CMP = cmpEntry?.cmp ?? 0;
            const presentValue = CMP ? CMP * stock.quantity : 0;
            const gainLoss =
              presentValue !== 0 ? presentValue - stock.investment : 0;

            const peRatio = financeEntry?.peRatio ?? 0;
            const latestEarnings = financeEntry?.eps ?? 0;

            return {
              ...stock,
              CMP,
              presentValue,
              gainLoss,
              peRatio,
              latestEarnings,
            };
          });
        }
        console.log(updatedPortfolio);

        setPortfolio(updatedPortfolio);
        showToast("Portfolio data loaded successfully!", "success");
      } catch (error) {
        console.error("Error loading portfolio data:", error);
        showToast("Error loading portfolio data.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set interval to update CMP every 15 seconds
    const interval = setInterval(updateCMPData, 15000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "2rem",
          }}
        >
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading portfolio data...
          </Typography>
        </Box>
      ) : (
        <>
          <Alert severity="info" sx={{ m: 2 }}>
            Portfolio data is updated every <strong>15 seconds</strong> with the
            latest CMP (Current Market Price).
          </Alert>
          <PortfolioTable data={portfolio} />
        </>
      )}
      {/* Global Snackbar */}
      <ToastSnackbar
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </>
  );
};

export default PortfolioPage;
