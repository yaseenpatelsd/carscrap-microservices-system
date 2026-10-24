import { homeForRole, useAuth } from '@/lib/auth'
import { Navigate } from 'react-router-dom'

/**
 * Bare-origin gate.
 *
 * Sign-in is the default entry point for the app, so an anonymous visitor
 * landing on `/` is sent straight to `/login`. Signed-in users are forwarded
 * to their own portal. The marketing home page stays reachable at `/home`
 * (linked from the navbar, footer and every auth screen) and never requires
 * a token.
 */
export function RootGate() {
  const { isAuthenticated, role } = useAuth()
  return <Navigate to={isAuthenticated ? homeForRole(role) : '/login'} replace />
}
