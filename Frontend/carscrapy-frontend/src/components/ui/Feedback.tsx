import { cn } from '@/lib/cn'
import { Inbox, Loader2, RefreshCw } from 'lucide-react'
import type { ReactNode } from 'react'

/** Small pill used for statuses and role tags. */
export function Badge({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        className,
      )}
    >
      {children}
    </span>
  )
}

/**
 * Consistent empty state. Used for both "nothing yet" and "no results",
 * so the app never shows a bare blank panel.
 */
export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: ReactNode
  title: string
  body?: string
  action?: ReactNode
}) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-ink-300 bg-white/60 px-6 py-12 text-center">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-ink-50 text-ink-300">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <p className="text-sm font-semibold text-ink-700">{title}</p>
      {body && <p className="mt-1 max-w-sm text-sm leading-relaxed text-ink-500">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

/** Centred loading spinner for full-section loads. */
export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="grid place-items-center gap-2 py-12 text-ink-400">
      <Loader2 className="h-5 w-5 animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

/**
 * Error state with a retry affordance. Used everywhere a query can fail,
 * so failures are recoverable without a full page reload.
 */
export function ErrorState({
  title = 'Something went wrong',
  body,
  onRetry,
}: {
  title?: string
  body?: string
  onRetry?: () => void
}) {
  return (
    <div className="grid place-items-center rounded-2xl border border-red-200 bg-red-50/50 px-6 py-12 text-center">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-red-100 text-red-500">
        <RefreshCw className="h-5 w-5" />
      </div>
      <p className="text-sm font-semibold text-ink-800">{title}</p>
      {body && <p className="mt-1 max-w-sm text-sm leading-relaxed text-ink-500">{body}</p>}
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost mt-4">
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
      )}
    </div>
  )
}

/** Simple responsive list container; rows are supplied by the caller. */
export function DataList({ children }: { children: ReactNode }) {
  return <div className="space-y-3">{children}</div>
}

/** Page-level heading with optional actions. */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink-950">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-ink-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}