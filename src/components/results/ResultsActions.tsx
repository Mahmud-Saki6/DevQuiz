"use client";

import Link from "next/link";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import toast from "react-hot-toast";

export default function ResultsActions({
  summary,
  newQuizHref = "/"
}: {
  summary: string;
  newQuizHref?: string;
}) {
  async function onShare() {
    try {
      await navigator.clipboard.writeText(summary);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy to clipboard");
    }
  }

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
      <Button component={Link} href={newQuizHref} variant="contained">
        New quiz
      </Button>
      <Button variant="outlined" onClick={onShare}>
        Share results
      </Button>
    </Stack>
  );
}

