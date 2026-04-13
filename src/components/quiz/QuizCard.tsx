"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function QuizCard({
  questionNumber,
  total,
  difficulty,
  topic,
  text,
  codeSnippet
}: {
  questionNumber: number;
  total: number;
  difficulty: string;
  topic: string;
  text: string;
  codeSnippet?: string | null;
}) {
  return (
    <Paper sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Chip label={difficulty} color="secondary" size="small" />
          <Chip label={topic} variant="outlined" size="small" />
          <Box sx={{ flex: 1 }} />
          <Typography variant="body2" color="text.secondary" fontWeight={700}>
            {questionNumber} / {total}
          </Typography>
        </Stack>

        <Typography variant="h6" fontWeight={900}>
          {text}
        </Typography>

        {codeSnippet ? (
          <Box
            component="pre"
            sx={{
              m: 0,
              p: 2,
              borderRadius: 2,
              bgcolor: "rgba(0,0,0,0.85)",
              color: "#e6edf3",
              overflowX: "auto",
              fontSize: 13,
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
            }}
          >
            {codeSnippet}
          </Box>
        ) : null}
      </Stack>
    </Paper>
  );
}

