import { HttpError } from '@/api/client'
import { QueryClient } from '@tanstack/react-query'

/**
 * Production-tuned React Query client.
 *
 * - retries transient failures twice, but never retries auth/permission
 *   errors or 4xx responses (retrying those just wastes time)
 * - caches for 30s so navigating between screens feels instant
 * - refetches on reconnect so a dropped network self-heals
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        if (error instanceof HttpError) {
          // Never retry client errors — the request was wrong, not unlucky.
          if (error.status >= 400 && error.status < 500) return false
        }
        return failureCount < 2
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    },
    mutations: {
      // Mutations are user-initiated; a retry could double-submit.
      retry: false,
    },
  },
})