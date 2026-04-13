import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProgressState {
  lastSessionId: string | null;
}

const initialState: ProgressState = {
  lastSessionId: null
};

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    setLastSessionId(state, action: PayloadAction<string | null>) {
      state.lastSessionId = action.payload;
    }
  }
});

export const { setLastSessionId } = progressSlice.actions;
export default progressSlice.reducer;

