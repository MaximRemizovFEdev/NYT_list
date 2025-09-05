import { configureStore } from "@reduxjs/toolkit";
import articlesReducer from "../features/articles/articlesSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
