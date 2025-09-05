import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  login,
  register,
  getProfile,
  type AuthResponse,
  type User,
} from "../../services/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: "idle",
};

export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
  const res = await fetch("http://localhost:3001/users/me", { credentials: "include" });
  if (res.ok) return res.json();
  throw new Error("Not authenticated");
});

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    const res = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ email, password }: { email: string; password: string }) => {
    const res = await fetch("http://localhost:3001/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Registration failed");
    return res.json();
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  // Просто очищаем cookies на клиенте
  document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = "succeeded";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.status = "succeeded";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.status = "succeeded";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = "idle";
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;