import { tokenStore } from '@/lib/token'
import type { ApiError } from '@/types/api'

/**
 * Base path for every API call.
 *
 * Defaults to `/api`, which works in both environments because:
 *  - dev:  Vite proxies /api → http://localhost:8080 (see vite.config.ts)
 *  - prod: NGINX proxies /api/ → http://api-gateway:8080/ (see nginx.conf)
 *
 * Override with VITE_API_BASE_URL when deploying behind a different path.
 */
export const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api'

/** How long a request may hang before we abort it. */
const REQUEST_TIMEOUT_MS = 20_000

/** Thrown for any non-2xx response, carrying the parsed backend error. */
export class HttpError extends Error {
  status: number
  body: ApiError | null
  requestId: string

  constructor(status: number, body: ApiError | null, requestId = '') {
    super(body?.message || body?.error || `Request failed (${status})`)
    this.name = 'HttpError'
    this.status = status
    this.body = body
    this.requestId = requestId
  }
}

/** Fired when the token is missing/expired. AuthProvider listens for this. */
export const UNAUTHORIZED_EVENT = 'carscrapy:unauthorized'

type Options = Omit<RequestInit, 'body'> & {
  body?: unknown
  /** Skip attaching the Authorization header. */
  anonymous?: boolean
  /** Abort the request after this many ms (default 20s). */
  timeoutMs?: number
}

/** Short correlation id so a user-visible error can be matched in logs. */
function makeRequestId(): string {
  return Math.random().toString(36).slice(2, 10)
}

/**
 * The single HTTP entry point for the whole app.
 * - prefixes the API base
 * - attaches the Bearer token
 * - enforces a timeout so the UI never hangs forever
 * - parses JSON errors into HttpError
 * - broadcasts a 401 so the app can log out cleanly
 */
export async function request<T>(path: string, options: Options = {}): Promise<T> {
  const { body, anonymous, headers, timeoutMs = REQUEST_TIMEOUT_MS, signal, ...rest } = options

  const requestId = makeRequestId()
  const finalHeaders = new Headers(headers)
  finalHeaders.set('X-Request-Id', requestId)
  if (body !== undefined && !finalHeaders.has('Content-Type')) {
    finalHeaders.set('Content-Type', 'application/json')
  }
  if (!anonymous) {
    const token = tokenStore.get()
    if (token) finalHeaders.set('Authorization', `Bearer ${token}`)
  }

  // Combine the caller's signal (if any) with our own timeout signal.
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  if (signal) {
    if (signal.aborted) controller.abort()
    else signal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timer)
    const aborted = err instanceof DOMException && err.name === 'AbortError'
    const message = aborted
      ? 'The request took too long. Please check your connection and try again.'
      : 'Cannot reach the server. Is the backend running?'
    throw new HttpError(0, { message }, requestId)
  }
  clearTimeout(timer)

  const text = await res.text()
  let parsed: unknown = null
  if (text) {
    try {
      parsed = JSON.parse(text)
    } catch {
      parsed = text
    }
  }

  if (!res.ok) {
    // 401 = expired/invalid token. Never treat a failed login as a logout.
    if (res.status === 401 && !anonymous) {
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT))
    }
    const errBody = (typeof parsed === 'object' && parsed !== null ? parsed : null) as ApiError | null
    throw new HttpError(res.status, errBody, requestId)
  }

  return parsed as T
}

export const api = {
  get: <T>(path: string, options?: Options) => request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: Options) =>
    request<T>(path, { ...options, body, method: 'POST' }),
  patch: <T>(path: string, body?: unknown, options?: Options) =>
    request<T>(path, { ...options, body, method: 'PATCH' }),
  del: <T>(path: string, body?: unknown, options?: Options) =>
    request<T>(path, { ...options, body, method: 'DELETE' }),

  /**
   * GET a collection. Guarantees an array even if the server (or a proxy
   * fallback) returns something else, so `.map`/`.find` can never crash.
   */
  list: async <T>(path: string, options?: Options): Promise<T[]> => {
    const data = await request<unknown>(path, { ...options, method: 'GET' })
    return Array.isArray(data) ? (data as T[]) : []
  },

  /** POST a collection, with the same array guarantee as `list`. */
  postList: async <T>(path: string, body?: unknown, options?: Options): Promise<T[]> => {
    const data = await request<unknown>(path, { ...options, body, method: 'POST' })
    return Array.isArray(data) ? (data as T[]) : []
  },
}

/** Maps any thrown value to a readable message for the UI. */
export function errorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    if (error.status === 0) return error.message
    if (error.status === 403) return 'You do not have permission to do that.'
    if (error.status === 404) return 'We could not find what you were looking for.'
    if (error.status >= 500) {
      return error.body?.message || 'The server ran into a problem. Please try again shortly.'
    }
    return error.body?.message || error.body?.error || error.message
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}

/** Reference id for support, shown alongside unexpected errors. */
export function errorReference(error: unknown): string | null {
  return error instanceof HttpError && error.requestId ? error.requestId : null
}