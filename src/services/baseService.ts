import { useSyncExternalStore } from 'react';
import { clear, getItem, setItem } from './localStore';
import { BASE_URL } from '@env';

// Central auth state. localStore (AsyncStorage) is async, so we mirror just the
// auth token in memory here: that gives the rest of the app a synchronous,
// reactive `isAuthenticated()` without turning localStore into a cache. Call
// `initAuth()` once at startup to hydrate it from storage.

export const baseUrl = BASE_URL;
export const getFullUrl = (endpoint: string) => `${baseUrl}${endpoint}`;

const TOKEN_KEY = 'token';

let token: string | null = null;
const listeners = new Set<() => void>();

const emit = () => {
  listeners.forEach(listener => listener());
};

// Load the persisted token into memory. Await this before the first render that
// depends on auth state (wired into App startup).
export const initAuth = async (): Promise<void> => {
  token = await getItem(TOKEN_KEY);
  emit();
};

export const isAuthenticated = (): boolean => Boolean(token);

export const getAuthToken = (): string | null => token;

// Persist a new token and flip auth state on. Call from the login flow once the
// OTP/credentials are verified.
export const login = async (newToken: string): Promise<void> => {
  token = newToken;
  emit();
  await setItem(TOKEN_KEY, newToken);
};

// Clear auth state everywhere. `clear()` wipes all of AsyncStorage, matching the
// previous Redux logout behaviour.
export const logout = async (): Promise<void> => {
  token = null;
  emit();
  await clear();
};

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

// Reactive hook — re-renders the consumer whenever auth state changes (login /
// logout), so the navigator, navbar and drawer all stay in sync.
export const useAuth = () => {
  const authed = useSyncExternalStore(subscribe, isAuthenticated);
  return { isAuthenticated: authed, login, logout };
};
