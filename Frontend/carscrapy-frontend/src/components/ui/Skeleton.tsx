import { cn } from '@/lib/cn'

/** Base shimmering block. Compose these to mirror the shape of real content. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-lg bg-ink-100',
        'after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer',
        'after:bg-gradient-to-r after:from-transparent after:via-white/70 after:to-transparent',
        'motion-reduce:after:animate-none',
        className,
      )}
    />
  )
}

/** A stack of text lines, sized like a paragraph. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn('h-3.5', i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  )
}

/** Placeholder for a single card (icon + title + body). */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('card p-5', className)}>
      <Skeleton className="h-11 w-11 rounded-xl" />
      <Skeleton className="mt-4 h-4 w-1/2" />
      <SkeletonText lines={2} className="mt-3" />
    </div>
  )
}

/** Responsive grid of skeleton cards, matching the app's card grids. */
export function SkeletonGrid({
  count = 6,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

/** Placeholder for the stat strip used on dashboards. */
export function SkeletonStats({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('grid gap-3 sm:grid-cols-3 sm:gap-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card flex items-center gap-3.5 p-4">
          <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
          <div className="w-full space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Placeholder rows for divider-style lists (avatar + two lines). */
export function SkeletonList({ rows = 4, className }: { rows?: number; className?: string }) {
  return (
    <ul className={cn('divide-y divide-ink-100', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="flex items-center gap-3 py-3">
          <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
          <div className="w-full space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default Skeleton
