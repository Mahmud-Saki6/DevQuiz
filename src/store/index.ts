import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import quizReducer from "@/store/features/quizSlice";
import userReducer from "@/store/features/userSlice";
import progressReducer from "@/store/features/progressSlice";

const rootReducer = combineReducers({
  quiz: quizReducer,
  user: userReducer,
  progress: progressReducer
});

const persistConfig = {
  key: "devquiz",
  storage,
  whitelist: ["quiz", "user"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: false
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

