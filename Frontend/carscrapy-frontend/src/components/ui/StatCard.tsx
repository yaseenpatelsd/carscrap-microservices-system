import { cn } from '@/lib/cn'
import type { LucideIcon } from 'lucide-react'

/** Compact metric tile used on every dashboard header. */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'brand',
}: {
  label: string
  value: string | number
  hint?: string
  icon: LucideIcon
  tone?: 'brand' | 'amber' | 'sky'
}) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600 ring-brand-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
    sky: 'bg-sky-50 text-sky-600 ring-sky-100',
  } as const

  return (
    <div className="card flex items-center gap-3.5 p-4">
      <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset', tones[tone])}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xl font-bold leading-tight text-ink-950">{value}</p>
        <p className="truncate text-xs text-ink-500">{label}</p>
        {hint && <p className="truncate text-[11px] text-ink-400">{hint}</p>}
      </div>
    </div>
  )
}