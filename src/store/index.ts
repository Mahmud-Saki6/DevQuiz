import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { createTransform, persistReducer, persistStore } from "redux-persist";

import quizReducer from "@/store/features/quizSlice";
import userReducer from "@/store/features/userSlice";
import progressReducer from "@/store/features/progressSlice";
import { initialQuizState } from "@/store/features/quizSlice";

const rootReducer = combineReducers({
  quiz: quizReducer,
  user: userReducer,
  progress: progressReducer
});

const quizTransform = createTransform(
  // inbound (to storage): persist only config, never active session state
  (inboundState: unknown, key) => {
    if (key !== "quiz" || !inboundState || typeof inboundState !== "object") {
      return inboundState;
    }
    const s = inboundState as typeof initialQuizState;
    return {
      language: s.language,
      languageId: s.languageId,
      topic: s.topic,
      topicId: s.topicId,
      category: s.category,
      difficulty: s.difficulty,
      questionCount: s.questionCount
    };
  },
  // outbound (from storage): merge into clean initial state
  (outboundState: unknown, key) => {
    if (key !== "quiz" || !outboundState || typeof outboundState !== "object") {
      return outboundState;
    }
    return { ...initialQuizState, ...(outboundState as object) };
  },
  { whitelist: ["quiz"] }
);

const persistConfig = {
  key: "devquiz",
  storage,
  whitelist: ["quiz", "user"],
  transforms: [quizTransform]
};

// redux-persist's typing makes slice states optional during rehydration.
// Our runtime always provides defaults, so we cast to keep TS + Next build happy.
const persistedReducer = persistReducer(
  persistConfig as any,
  rootReducer as any
) as unknown as typeof rootReducer;

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: false
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

