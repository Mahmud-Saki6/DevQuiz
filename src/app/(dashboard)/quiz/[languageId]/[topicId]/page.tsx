"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/store";
import {
  answerQuestion,
  generateQuiz,
  nextQuestion,
  resetQuiz,
  submitQuiz
} from "@/store/features/quizSlice";
import type { Question } from "@/types";
import QuizCard from "@/components/quiz/QuizCard";
import AnswerButton from "@/components/quiz/AnswerButton";
import ExplanationBox from "@/components/quiz/ExplanationBox";
import ProgressBar from "@/components/quiz/ProgressBar";

function storageKey(languageId: string, topicId: string, difficulty: string, count: number) {
  // v2 bumps cache to avoid loading older unshuffled questions
  return `devquiz:v2:${languageId}:${topicId}:${difficulty}:${count}`;
}

export default function ActiveQuizPage() {
  const router = useRouter();
  const { languageId, topicId } = useParams<{ languageId: string; topicId: string }>();
  const dispatch = useDispatch();
  const quiz = useSelector((s: RootState) => s.quiz);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const questions = quiz.questions;
  const current = questions[quiz.currentIndex];
  const progress = questions.length ? ((quiz.currentIndex + 1) / questions.length) * 100 : 0;

  const key = useMemo(() => {
    return storageKey(languageId, topicId, quiz.difficulty, quiz.questionCount);
  }, [languageId, topicId, quiz.difficulty, quiz.questionCount]);

  useEffect(() => {
    // Load cached questions if available
    const cached = sessionStorage.getItem(key);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as { questions: Question[] };
        // hydrate by dispatching generateQuiz.fulfilled-like state
        dispatch(resetQuiz());
        // quick set via dispatching thunk result isn't trivial; simplest: re-generate if shape mismatch
        if (Array.isArray(parsed.questions) && parsed.questions.length) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (dispatch as any)({
            type: generateQuiz.fulfilled.type,
            payload: parsed
          });
          return;
        }
      } catch {}
    }

    if (!quiz.language || !quiz.topic) {
      // If user deep-linked, still generate with generic topic label; backend stores topicId anyway
    }

    // Generate new
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (dispatch as any)(
      generateQuiz({
        language: quiz.language ?? "Programming",
        topic: quiz.topic ?? "General",
        difficulty: quiz.difficulty,
        count: quiz.questionCount
      })
    );
  }, [dispatch, key, quiz.difficulty, quiz.language, quiz.questionCount, quiz.topic]);

  useEffect(() => {
    if (quiz.status === "active" && quiz.questions.length) {
      sessionStorage.setItem(key, JSON.stringify({ questions: quiz.questions }));
    }
  }, [key, quiz.questions, quiz.status]);

  useEffect(() => {
    setSelectedIndex(null);
    setRevealed(false);
  }, [quiz.currentIndex]);

  if (quiz.status === "loading" || quiz.status === "idle") {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper sx={{ p: 4, display: "grid", placeItems: "center" }}>
          <Stack spacing={2} alignItems="center">
            <CircularProgress />
            <Typography fontWeight={700}>Generating your quiz…</Typography>
            <Typography variant="body2" color="text.secondary">
              If the AI provider is slow, this can take up to 30 seconds.
            </Typography>
          </Stack>
        </Paper>
      </Container>
    );
  }

  if (quiz.status === "error") {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={900} color="error">
            Couldn’t generate quiz
          </Typography>
          <Typography sx={{ mt: 1 }} color="text.secondary">
            {quiz.error ?? "Unknown error"}
          </Typography>
          <Button sx={{ mt: 3 }} variant="contained" onClick={() => location.reload()}>
            Try again
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!current) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper sx={{ p: 4 }}>
          <Typography fontWeight={800}>No questions loaded.</Typography>
        </Paper>
      </Container>
    );
  }

  const correctIndex = current.correctIndex;

  async function onSelect(idx: number) {
    if (revealed) return;
    setSelectedIndex(idx);
    setRevealed(true);
    dispatch(
      answerQuestion({
        questionId: current.id,
        questionText: current.text,
        options: current.options,
        selectedIndex: idx,
        correctIndex,
        isCorrect: idx === correctIndex,
        topic: current.topic,
        explanation: current.explanation
      })
    );
  }

  async function onNext() {
    const isLast = quiz.currentIndex === quiz.questions.length - 1;
    if (!isLast) {
      dispatch(nextQuestion());
      return;
    }

    const score = quiz.answers.filter((a) => a.isCorrect).length;
    setSubmitting(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await (dispatch as any)(
        submitQuiz({
          languageId,
          topicId,
          difficulty: quiz.difficulty,
          score,
          total: quiz.questions.length,
          answers: quiz.answers
        })
      );
      const sessionId = res?.payload?.sessionId as string | undefined;
      if (sessionId) {
        sessionStorage.removeItem(key);
        router.push(`/results/${sessionId}`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <ProgressBar value={progress} />

        <QuizCard
          questionNumber={quiz.currentIndex + 1}
          total={quiz.questions.length}
          difficulty={quiz.difficulty}
          topic={current.topic}
          text={current.text}
          codeSnippet={current.codeSnippet}
        />

        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <Stack spacing={1}>
            {current.options.map((opt, idx) => {
              const show = revealed;
              const isCorrect = idx === correctIndex;
              const isSelected = idx === selectedIndex;
              const state =
                show && isCorrect ? "correct" : show && isSelected && !isCorrect ? "incorrect" : "neutral";
              return (
                <AnswerButton
                  key={idx}
                  text={opt}
                  disabled={show}
                  onClick={() => onSelect(idx)}
                  state={state}
                />
              );
            })}
          </Stack>

          <Box sx={{ mt: 2 }}>
            <ExplanationBox open={revealed} text={current.explanation} />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              disabled={!revealed || submitting}
              onClick={onNext}
              sx={{ width: 180 }}
            >
              {quiz.currentIndex === quiz.questions.length - 1 ? "Finish" : "Next question"}
            </Button>
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
}

