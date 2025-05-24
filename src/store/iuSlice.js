// store/slices/uiSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    globalLoading: false,
    secondaryLoading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
    setSecondaryLoading: (state, action) => {
      state.secondaryLoading = action.payload;
    },
  },
});

export const { setLoading, setSecondaryLoading } = uiSlice.actions;
export default uiSlice.reducer;
