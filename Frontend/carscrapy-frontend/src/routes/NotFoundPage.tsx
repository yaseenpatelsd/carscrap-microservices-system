import { Button } from '@/components/ui/Button'
import { useAuth } from '@/lib/auth'
import { homeForRole } from '@/lib/auth'
import { Compass, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  const { isAuthenticated, role } = useAuth()
  const target = isAuthenticated ? homeForRole(role) : '/login'
  const label = isAuthenticated ? 'Back to dashboard' : 'Go to sign in'

  return (
    <div className="grid min-h-screen place-items-center bg-ink-50 px-6">
      <div className="text-center animate-fade-up">
        <span className="icon-tile mx-auto h-14 w-14">
          <Compass className="h-6 w-6" />
        </span>
        <p className="eyebrow mt-5">Error 404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink-950">Page not found</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <Link to={target} className="mt-6 inline-block">
          <Button>
            <Home className="h-4 w-4" />
            {label}
          </Button>
        </Link>
      </div>
    </div>
  )
}