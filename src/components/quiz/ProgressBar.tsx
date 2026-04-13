"use client";

import LinearProgress from "@mui/material/LinearProgress";

export default function ProgressBar({ value }: { value: number }) {
  return <LinearProgress variant="determinate" value={value} />;
}

