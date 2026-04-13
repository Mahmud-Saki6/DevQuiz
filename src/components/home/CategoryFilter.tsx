"use client";

import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

const options = [
  { id: "all", label: "All" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "database", label: "Database" },
  { id: "devops", label: "DevOps" },
  { id: "ai-ml", label: "AI/ML" }
] as const;

export default function CategoryFilter({
  value,
  onChange
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {options.map((o) => (
        <Chip
          key={o.id}
          label={o.label}
          color={value === o.id ? "primary" : "default"}
          variant={value === o.id ? "filled" : "outlined"}
          onClick={() => onChange(o.id)}
        />
      ))}
    </Stack>
  );
}

