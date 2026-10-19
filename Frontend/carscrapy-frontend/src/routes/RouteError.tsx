import { Button } from '@/components/ui/Button'
import { useAuth, homeForRole } from '@/lib/auth'
import { RefreshCw, TriangleAlert } from 'lucide-react'
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'

/**
 * Route-level error boundary. Shown when a route element throws during render
 * (for example a chunk that failed to load after a redeploy). Gives the user a
 * clear recovery path instead of React Router's default developer screen.
 */
export function RouteError() {
  const error = useRouteError()
  const { isAuthenticated, role } = useAuth()

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'An unexpected error occurred.'

  return (
    <div className="grid min-h-screen place-items-center bg-ink-50 px-6">
      <div className="w-full max-w-md text-center animate-fade-up">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-100 text-red-500 ring-1 ring-inset ring-red-200">
          <TriangleAlert className="h-6 w-6" />
        </span>
        <p className="eyebrow mt-5 text-red-500">Something broke</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink-950">
          This page couldn&apos;t load
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
          This often happens after an update — a quick reload usually fixes it.
        </p>
        <pre className="mx-auto mt-4 max-w-sm overflow-x-auto rounded-xl border border-ink-200 bg-white px-3 py-2 text-left text-[11px] text-ink-500">
          {message}
        </pre>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4" />
            Reload page
          </Button>
          <Link to={isAuthenticated ? homeForRole(role) : '/login'}>
            <Button variant="ghost">Go home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
