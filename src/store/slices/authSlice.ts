import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Auth state for the whole app. This slice is the only one persisted across
// app restarts (see store.ts whitelist) — its shape matters more than most.
// Keep it minimal; don't dump session-only UI flags here.

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  // Reserved for in-flight login/OTP requests. Kept in the slice so any
  // component can show a spinner without lifting state around.
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Mark the start of a login attempt. Clears any stale error so the UI
    // doesn't show last attempt's message while the new one is in flight.
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    // Full reset. We don't try to be clever and "keep the user object for the
    // farewell screen" — logout means everything goes.
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    // Partial profile patch — used after profile edits so we don't need a
    // full re-fetch just to update one field.
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
