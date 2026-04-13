import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  name: string | null;
  email: string | null;
  streak: number;
}

export const initialUserState: UserState = {
  name: null,
  email: null,
  streak: 0
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<{ name: string | null; email: string | null }>
    ) {
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    setStreak(state, action: PayloadAction<number>) {
      state.streak = action.payload;
    },
    clearUser(state) {
      state.name = null;
      state.email = null;
      state.streak = 0;
    }
  }
});

export const { setUser, setStreak, clearUser } = userSlice.actions;
export default userSlice.reducer;

