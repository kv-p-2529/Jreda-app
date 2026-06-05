import { QueryClient } from '@tanstack/react-query';

// Shared React Query client. Defaults are tuned for a mobile app:
//   - 5 min stale time: most screens won't refetch when navigating back to
//     them within a few minutes, which keeps the UI snappy on slow networks.
//   - 30 min gc: cached data is held a while after a screen unmounts so a
//     quick return to the screen feels instant.
//   - retry=2 for queries (transient network blips), 0 for mutations
//     (mutations are not idempotent — silent retries can double-charge).
//   - refetchOnWindowFocus off: doesn't matter on mobile and was firing on
//     every keyboard appearance, which felt aggressive.
//   - refetchOnReconnect 'always': user lost signal, came back — give them
//     fresh data.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 0,
    },
  },
});
