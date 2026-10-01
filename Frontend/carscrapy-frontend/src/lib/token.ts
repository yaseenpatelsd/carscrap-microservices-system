import type { JwtPayload, Role } from '@/types/api'

export type { Role }

const TOKEN_KEY = 'carscrapy.token'

export const tokenStore = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  set(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
  },
}

/**
 * Decodes the JWT payload without verifying the signature.
 * Verification is the server's job — we only read it for UI decisions
 * (which route to show, what the user's name is).
 */
export function decodeToken(token: string | null): JwtPayload | null {
  if (!token) return null
  try {
    const [, payload] = token.split('.')
    if (!payload) return null
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(normalized)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    return JSON.parse(json) as JwtPayload
  } catch {
    return null
  }
}

export function currentUser(): JwtPayload | null {
  const payload = decodeToken(tokenStore.get())
  if (!payload) return null
  // exp is in seconds
  if (payload.exp * 1000 <= Date.now()) return null
  return payload
}

export function isGuest(): boolean {
  return currentUser()?.role === 'GUEST'
}