import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/sign-in/store/authSlice";
import uiReducer from "./iuSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
});


