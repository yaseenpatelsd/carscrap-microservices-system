import { UNAUTHORIZED_EVENT } from '@/api/client'
import { currentUser, tokenStore } from '@/lib/token'
import type { JwtPayload, Role } from '@/types/api'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

interface AuthState {
  user: JwtPayload | null
  role: Role | null
  isAuthenticated: boolean
  isGuest: boolean
  /** True for SUPER_ADMIN, ADMIN and STAFF. */
  isStaffRole: boolean
  /** Stores a freshly issued JWT and updates state. */
  signIn: (token: string) => void
  signOut: () => void
}

const AuthContext = createContext<AuthState | null>(null)

/** Landing route for a role after sign-in. */
export function homeForRole(role: Role | null | undefined): string {
  switch (role) {
    case 'SUPER_ADMIN':
      return '/super-admin'
    case 'ADMIN':
      return '/admin'
    case 'STAFF':
      return '/staff'
    default:
      return '/dashboard'
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => tokenStore.get())
  const [user, setUser] = useState<JwtPayload | null>(() => currentUser())

  // Re-derive the user whenever the token changes.
  useEffect(() => {
    setUser(currentUser())
  }, [token])

  // A 401 from any request means the token is dead — clear it.
  useEffect(() => {
    function handleUnauthorized() {
      tokenStore.clear()
      setToken(null)
      setUser(null)
    }
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [])

  // Keep multiple tabs in sync.
  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === 'carscrapy.token') {
        setToken(event.newValue)
        setUser(currentUser())
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const signIn = useCallback((newToken: string) => {
    tokenStore.set(newToken)
    setToken(newToken)
  }, [])

  const signOut = useCallback(() => {
    tokenStore.clear()
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo<AuthState>(() => {
    const role = user?.role ?? null
    return {
      user,
      role,
      isAuthenticated: !!user,
      isGuest: role === 'GUEST',
      isStaffRole: role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'STAFF',
      signIn,
      signOut,
    }
  }, [user, signIn, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}