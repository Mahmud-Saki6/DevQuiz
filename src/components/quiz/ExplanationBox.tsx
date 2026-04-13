"use client";

import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default function ExplanationBox({
  open,
  text
}: {
  open: boolean;
  text: string;
}) {
  return (
    <Collapse in={open} timeout={250}>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Typography fontWeight={900} sx={{ mb: 0.5 }}>
          Explanation
        </Typography>
        <Typography color="text.secondary">{text}</Typography>
      </Paper>
    </Collapse>
  );
}

