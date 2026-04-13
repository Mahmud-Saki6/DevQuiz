"use client";

import { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";

export default function QuizTimer({
  enabled = false,
  seconds = 0,
  onExpire
}: {
  enabled?: boolean;
  seconds?: number;
  onExpire?: () => void;
}) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (!enabled) return;
    setRemaining(seconds);
  }, [enabled, seconds]);

  useEffect(() => {
    if (!enabled) return;
    if (remaining <= 0) {
      onExpire?.();
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [enabled, remaining, onExpire]);

  if (!enabled) return null;

  return <Chip size="small" label={`⏱ ${remaining}s`} variant="outlined" />;
}

