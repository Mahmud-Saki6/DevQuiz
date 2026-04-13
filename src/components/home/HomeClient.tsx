"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Language, Topic } from "@prisma/client";
import { useDispatch, useSelector } from "react-redux";

import CategoryFilter from "@/components/home/CategoryFilter";
import LanguageGrid from "@/components/home/LanguageGrid";
import QuizConfigPanel from "@/components/home/QuizConfigPanel";
import type { RootState } from "@/store";
import { setCategory, setLanguage, setTopic } from "@/store/features/quizSlice";
import { initialQuizState } from "@/store/features/quizSlice";

type LanguageWithTopics = Language & { topics: Topic[] };

export default function HomeClient({ languages }: { languages: LanguageWithTopics[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const dispatch = useDispatch();
  const quiz = useSelector((s: RootState) => s.quiz ?? initialQuizState);

  // deep-link support: ?languageId=...&topicId=...&difficulty=...&count=...&topics=comma...
  const preselectedTopicId = params.get("topicId");
  const preselectedLanguageId = params.get("languageId");

  const filtered = useMemo(() => {
    if (quiz.category === "all") return languages;
    return languages.filter((l) => l.categories.includes(quiz.category));
  }, [languages, quiz.category]);

  const selectedLanguage = useMemo(() => {
    const byState = quiz.languageId
      ? languages.find((l) => l.id === quiz.languageId)
      : null;
    if (byState) return byState;
    if (preselectedLanguageId) return languages.find((l) => l.id === preselectedLanguageId) ?? null;
    return null;
  }, [languages, preselectedLanguageId, quiz.languageId]);

  const selectedTopic = useMemo(() => {
    if (!selectedLanguage) return null;
    const byState = quiz.topicId
      ? selectedLanguage.topics.find((t) => t.id === quiz.topicId)
      : null;
    if (byState) return byState;
    if (preselectedTopicId) return selectedLanguage.topics.find((t) => t.id === preselectedTopicId) ?? null;
    return null;
  }, [preselectedTopicId, quiz.topicId, selectedLanguage]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h5" fontWeight={900} color="primary.main">
              Configure your DevQuiz session
            </Typography>
            <Typography color="text.secondary">
              Pick a category, language, and topic — then start an AI-generated quiz.
            </Typography>
          </Box>

          <CategoryFilter
            value={quiz.category}
            onChange={(v) => dispatch(setCategory(v))}
          />

          <LanguageGrid
            languages={filtered}
            selectedLanguageId={selectedLanguage?.id ?? null}
            onSelect={(l) => dispatch(setLanguage({ language: l.name, languageId: l.id }))}
          />

          <QuizConfigPanel
            language={selectedLanguage}
            selectedTopicId={selectedTopic?.id ?? null}
            onSelectTopic={(t) => dispatch(setTopic({ topic: t.title, topicId: t.id }))}
            onStart={() => {
              if (!selectedLanguage) return;
              // If topic not chosen, route to language topic list
              if (!selectedTopic) {
                router.push(`/quiz/${selectedLanguage.id}`);
              } else {
                router.push(`/quiz/${selectedLanguage.id}/${selectedTopic.id}`);
              }
            }}
          />
        </Stack>
      </Paper>
    </Container>
  );
}

