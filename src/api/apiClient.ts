import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { BASE_URL } from '@env';
import { getAuthToken } from '@/services/baseService';

// Single shared HTTP client. Every API call should go through this instance so
// the auth header is attached automatically and errors are funnelled through
// one place. If you find yourself calling `axios.get(...)` directly, route it
// through here instead.

const apiClient = axios.create({
  baseURL: `${BASE_URL}`,
  timeout: 15000,
});

// Request interceptor — read the latest auth token on every call. baseService
// keeps the token in memory (updated on login/logout), so a logout/login during
// an in-flight request still attaches the right token.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const token = getAuthToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error reading token from state', error);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Response interceptor — centralized error logging. Individual screens still
// get the rejected promise, so per-call error handling stays where it belongs.
//
// TODO: 401 currently just warns. Once we have a refresh-token flow, this is
// where we kick it off (or dispatch logout if refresh fails).
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        console.warn('API 401: session expired');
      }
    } else if (error.request) {
      console.error('Network error — no response from server', error.message);
    } else {
      console.error('API error:', error.message);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
