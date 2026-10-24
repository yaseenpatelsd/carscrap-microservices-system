import { cn } from '@/lib/cn'
import type { LucideIcon } from 'lucide-react'

type Tone = 'brand' | 'amber' | 'sky' | 'rose' | 'violet'

const TONES: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-600 ring-brand-100',
  amber: 'bg-amber-50 text-amber-600 ring-amber-100',
  sky: 'bg-sky-50 text-sky-600 ring-sky-100',
  rose: 'bg-rose-50 text-rose-600 ring-rose-100',
  violet: 'bg-violet-50 text-violet-600 ring-violet-100',
}

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
  tone?: Tone
}) {
  return (
    <div className="card flex items-center gap-3.5 p-4 transition-colors duration-200 hover:border-ink-300">
      <span
        className={cn(
          'grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset',
          TONES[tone],
        )}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xl font-bold leading-tight tabular-nums text-ink-950">{value}</p>
        <p className="truncate text-xs text-ink-500">{label}</p>
        {hint && <p className="truncate text-[11px] text-ink-400">{hint}</p>}
      </div>
    </div>
  )
}
