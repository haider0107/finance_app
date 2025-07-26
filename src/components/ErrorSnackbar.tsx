"use client";

import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface ErrorSnackbarProps {
  error: string | null;
  setError: (value: string | null) => void;
}

const ErrorSnackbar: React.FC<ErrorSnackbarProps> = ({ error, setError }) => {
  return (
    <Snackbar
      open={!!error}
      autoHideDuration={4000}
      onClose={() => setError(null)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={() => setError(null)}
        severity="error"
        sx={{ width: "100%" }}
      >
        {error}
      </Alert>
    </Snackbar>
  );
};

export default ErrorSnackbar;
