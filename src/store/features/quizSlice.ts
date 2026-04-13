import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type { Answer, Question } from "@/types";

export type Difficulty = "easy" | "medium" | "hard";

export interface QuizState {
  language: string | null;
  languageId: string | null;
  topic: string | null;
  topicId: string | null;
  category: string;
  difficulty: Difficulty;
  questionCount: 10 | 20 | 30;
  questions: Question[];
  currentIndex: number;
  answers: Answer[];
  status: "idle" | "loading" | "active" | "complete" | "error";
  sessionId: string | null;
  error: string | null;
}

export const initialQuizState: QuizState = {
  language: null,
  languageId: null,
  topic: null,
  topicId: null,
  category: "all",
  difficulty: "easy",
  questionCount: 10,
  questions: [],
  currentIndex: 0,
  answers: [],
  status: "idle",
  sessionId: null,
  error: null
};

export const generateQuiz = createAsyncThunk<
  { questions: Question[] },
  { language: string; topic: string; difficulty: Difficulty; count: number },
  { state: RootState; rejectValue: string }
>("quiz/generate", async (payload, thunkApi) => {
  try {
    const res = await fetch("/api/quiz/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const text = await res.text();
      try {
        const json = JSON.parse(text) as { error?: string; message?: string };
        const msg =
          json.error && json.message
            ? `${json.error}: ${json.message}`
            : json.error ?? json.message;
        return thunkApi.rejectWithValue(msg || "Failed to generate quiz");
      } catch {
        return thunkApi.rejectWithValue(text || "Failed to generate quiz");
      }
    }
    return (await res.json()) as { questions: Question[] };
  } catch (e) {
    return thunkApi.rejectWithValue(
      e instanceof Error ? e.message : "Failed to generate quiz"
    );
  }
});

export const submitQuiz = createAsyncThunk<
  { sessionId: string },
  {
    languageId: string;
    topicId: string;
    difficulty: Difficulty;
    score: number;
    total: number;
    answers: Answer[];
  },
  { rejectValue: string }
>("quiz/submit", async (payload, thunkApi) => {
  try {
    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) return thunkApi.rejectWithValue(await res.text());
    return (await res.json()) as { sessionId: string };
  } catch (e) {
    return thunkApi.rejectWithValue(
      e instanceof Error ? e.message : "Failed to submit quiz"
    );
  }
});

const quizSlice = createSlice({
  name: "quiz",
  initialState: initialQuizState,
  reducers: {
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
    },
    setLanguage(
      state,
      action: PayloadAction<{ language: string; languageId: string }>
    ) {
      state.language = action.payload.language;
      state.languageId = action.payload.languageId;
      state.topic = null;
      state.topicId = null;
    },
    setTopic(state, action: PayloadAction<{ topic: string; topicId: string }>) {
      state.topic = action.payload.topic;
      state.topicId = action.payload.topicId;
    },
    setDifficulty(state, action: PayloadAction<Difficulty>) {
      state.difficulty = action.payload;
    },
    setQuestionCount(state, action: PayloadAction<10 | 20 | 30>) {
      state.questionCount = action.payload;
    },
    answerQuestion(state, action: PayloadAction<Answer>) {
      state.answers.push(action.payload);
    },
    nextQuestion(state) {
      state.currentIndex += 1;
    },
    resetQuiz(state) {
      state.questions = [];
      state.currentIndex = 0;
      state.answers = [];
      state.status = "idle";
      state.sessionId = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateQuiz.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.questions = [];
        state.currentIndex = 0;
        state.answers = [];
        state.sessionId = null;
      })
      .addCase(generateQuiz.fulfilled, (state, action) => {
        state.questions = action.payload.questions;
        state.status = "active";
      })
      .addCase(generateQuiz.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload ?? "Failed to generate quiz";
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.sessionId = action.payload.sessionId;
        state.status = "complete";
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to submit quiz";
      });
  }
});

export const {
  setCategory,
  setLanguage,
  setTopic,
  setDifficulty,
  setQuestionCount,
  answerQuestion,
  nextQuestion,
  resetQuiz
} = quizSlice.actions;

export default quizSlice.reducer;

