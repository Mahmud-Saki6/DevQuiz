"use client";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function ScoreSummary({
  score,
  total,
  correct,
  missed
}: {
  score: number;
  total: number;
  correct: number;
  missed: number;
}) {
  const pct = total ? Math.round((score / total) * 100) : 0;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={0.5}>
            <Typography color="text.secondary" fontWeight={700}>
              Overall
            </Typography>
            <Typography variant="h4" fontWeight={900}>
              {pct}%
            </Typography>
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={0.5}>
            <Typography color="text.secondary" fontWeight={700}>
              Correct
            </Typography>
            <Typography variant="h4" fontWeight={900} color="success.main">
              {correct}
            </Typography>
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={0.5}>
            <Typography color="text.secondary" fontWeight={700}>
              Missed
            </Typography>
            <Typography variant="h4" fontWeight={900} color="error.main">
              {missed}
            </Typography>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}

