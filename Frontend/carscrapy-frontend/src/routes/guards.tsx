import { homeForRole, useAuth } from '@/lib/auth'
import type { Role } from '@/types/api'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

/**
 * Blocks access to app routes unless a valid (non-expired) JWT exists.
 * Guests are allowed through — they hold a real token from /guest/register.
 */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}

/** Keeps signed-in users away from the login/register screens. */
export function PublicOnlyRoute() {
  const { isAuthenticated, role } = useAuth()
  if (isAuthenticated) return <Navigate to={homeForRole(role)} replace />
  return <Outlet />
}

/**
 * Restricts a branch to specific roles. Anyone signed in with the wrong
 * role is bounced to their own home rather than shown a dead end.
 */
export function RequireRole({ allow }: { allow: Role[] }) {
  const { role } = useAuth()
  if (!role) return <Navigate to="/login" replace />
  if (!allow.includes(role)) return <Navigate to={homeForRole(role)} replace />
  return <Outlet />
}

/** Customer area: USER and GUEST share the same screens. */
export const CUSTOMER_ROLES: Role[] = ['USER', 'GUEST']