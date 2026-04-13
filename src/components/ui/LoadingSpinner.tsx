"use client";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoadingSpinner() {
  return (
    <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
      <CircularProgress />
    </Box>
  );
}

