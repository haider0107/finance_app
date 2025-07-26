"use client";

import React from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

interface ToastSnackbarProps {
  open: boolean;
  message: string;
  severity?: AlertColor; // 'error' | 'warning' | 'info' | 'success'
  onClose: () => void;
  duration?: number;
}

const ToastSnackbar: React.FC<ToastSnackbarProps> = ({
  open,
  message,
  severity = "info",
  onClose,
  duration = 4000,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastSnackbar;
