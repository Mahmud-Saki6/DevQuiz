"use client";

import { useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import type { Language, Topic } from "@prisma/client";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/store";
import { setDifficulty, setQuestionCount } from "@/store/features/quizSlice";
import { initialQuizState } from "@/store/features/quizSlice";

type LanguageWithTopics = Language & { topics: Topic[] };

export default function QuizConfigPanel({
  language,
  selectedTopicId,
  onSelectTopic,
  onStart
}: {
  language: LanguageWithTopics | null;
  selectedTopicId: string | null;
  onSelectTopic: (t: Topic) => void;
  onStart: () => void;
}) {
  const dispatch = useDispatch();
  const quiz = useSelector((s: RootState) => s.quiz ?? initialQuizState);

  const topicChips = useMemo(() => {
    if (!language) return [];
    return language.topics;
  }, [language]);

  return (
    <Box>
      <Divider sx={{ my: 2 }} />
      <Stack spacing={2}>
        <Box>
          <Typography fontWeight={800}>Topics</Typography>
          <Typography variant="body2" color="text.secondary">
            Pick one topic for a focused quiz (or start without selecting to see the full list).
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {topicChips.map((t) => (
            <Chip
              key={t.id}
              label={t.title}
              onClick={() => onSelectTopic(t)}
              color={selectedTopicId === t.id ? "primary" : "default"}
              variant={selectedTopicId === t.id ? "filled" : "outlined"}
            />
          ))}
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Box>
            <Typography fontWeight={800} sx={{ mb: 1 }}>
              Difficulty
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={quiz.difficulty}
              onChange={(_, v) => v && dispatch(setDifficulty(v))}
              size="small"
            >
              <ToggleButton value="easy">Easy</ToggleButton>
              <ToggleButton value="medium">Medium</ToggleButton>
              <ToggleButton value="hard">Hard</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box>
            <Typography fontWeight={800} sx={{ mb: 1 }}>
              Questions
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={quiz.questionCount}
              onChange={(_, v) => v && dispatch(setQuestionCount(v))}
              size="small"
            >
              <ToggleButton value={10}>10</ToggleButton>
              <ToggleButton value={20}>20</ToggleButton>
              <ToggleButton value={30}>30</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Stack>

        <Button
          variant="contained"
          size="large"
          onClick={onStart}
          disabled={!language}
        >
          Start Quiz
        </Button>
      </Stack>
    </Box>
  );
}

