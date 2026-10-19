import { Loading } from '@/components/ui/Feedback'

/**
 * Suspense fallback used while a lazily-loaded route chunk downloads.
 * Kept lightweight so it never itself causes layout shift.
 */
export function RouteFallback() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <Loading label="Loading…" />
    </div>
  )
}
