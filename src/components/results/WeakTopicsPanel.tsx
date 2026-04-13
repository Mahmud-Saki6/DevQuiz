"use client";

import Link from "next/link";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { difficultyStepHarder } from "@/lib/utils";

export default function WeakTopicsPanel({
  weakTopics,
  languageId,
  topicId,
  difficulty
}: {
  weakTopics: string[];
  languageId: string;
  topicId: string;
  difficulty: "easy" | "medium" | "hard";
}) {
  if (!weakTopics.length) return null;

  const harder = difficultyStepHarder(difficulty);

  return (
    <Alert severity="warning">
      <AlertTitle>Weak topics</AlertTitle>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Focus on these areas next.
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
        {weakTopics.map((t) => (
          <Chip key={t} label={t} />
        ))}
      </Stack>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Button
          component={Link}
          href={`/quiz/${languageId}/${topicId}?difficulty=${harder}`}
          variant="contained"
          size="small"
        >
          Practice this topic
        </Button>
        <Button
          component={Link}
          href={`/?languageId=${languageId}&topicId=${topicId}&difficulty=${harder}`}
          variant="outlined"
          size="small"
        >
          Retry weak topics only
        </Button>
      </Box>
    </Alert>
  );
}

