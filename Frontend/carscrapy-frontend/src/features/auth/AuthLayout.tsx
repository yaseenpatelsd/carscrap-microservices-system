import { Recycle, ShieldCheck, Sparkles, Star, Truck } from 'lucide-react'
import type { ReactNode } from 'react'

/** Brand wordmark used across auth screens. */
export function Logo({ className = '', tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient text-white shadow-brand">
        <span aria-hidden className="absolute inset-0 rounded-xl bg-sheen" />
        <Recycle className="relative h-5 w-5" />
      </span>
      <span
        className={`text-lg font-bold tracking-tight ${
          tone === 'light' ? 'text-white' : 'text-ink-900'
        }`}
      >
        Car<span className={tone === 'light' ? 'text-brand-300' : 'text-brand-600'}>Scrapy</span>
      </span>
    </div>
  )
}

const POINTS = [
  { icon: Sparkles, title: 'Instant valuation', body: 'Get a scrap price estimate in seconds.' },
  { icon: Truck, title: 'Certified yards', body: 'Compare verified recyclers near you.' },
  { icon: ShieldCheck, title: 'Book with confidence', body: 'Track every appointment end to end.' },
]

/**
 * Split-screen layout: form on the left, brand panel on the right.
 * The brand panel is hidden on small screens so the form stays prominent.
 */
export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Form column */}
      <div className="flex w-full flex-col px-6 py-8 sm:px-10 lg:w-1/2 lg:px-16">
        <Logo className="animate-fade-in" />

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm animate-fade-up">
            <header className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">{title}</h1>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{subtitle}</p>
            </header>

            {children}

            {footer && <div className="mt-8 text-center text-sm text-ink-500">{footer}</div>}
          </div>
        </div>

        <p className="text-center text-xs text-ink-400 lg:text-left">
          © {new Date().getFullYear()} CarScrapy · Certified vehicle recycling
        </p>
      </div>

      {/* Brand column */}
      <aside className="relative hidden overflow-hidden bg-ink-gradient lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:px-16">
        {/* Decorative gradient blobs */}
        <div
          aria-hidden
          className="absolute -right-20 -top-24 h-[28rem] w-[28rem] animate-blob rounded-full bg-brand-500/30 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-20 h-[26rem] w-[26rem] animate-blob rounded-full bg-brand-700/30 blur-3xl [animation-delay:4s]"
        />
        <div
          aria-hidden
          className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl"
        />
        {/* Grid overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
        {/* Fade the grid toward the edges */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/60"
        />

        <div className="relative z-10 max-w-md animate-fade-up [animation-delay:120ms]">
          <p className="pill mb-5 border-white/15 bg-white/5 text-brand-200 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400 shadow-[0_0_0_3px_rgba(70,189,139,0.25)]" />
            Certified vehicle recycling
          </p>
          <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-white xl:text-4xl">
            Turn your old car into value — not a headache.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-300">
            One dashboard for pricing, yard discovery, and appointment tracking across India.
          </p>

          {/* Trust row */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {['#22a271', '#46bd8b', '#15825b', '#0e4433'].map((c, i) => (
                <span
                  key={c}
                  className="grid h-8 w-8 place-items-center rounded-full border-2 border-ink-950 text-[10px] font-bold text-white"
                  style={{ backgroundColor: c }}
                >
                  {['Y', 'A', 'R', 'K'][i]}
                </span>
              ))}
            </div>
            <div className="text-xs leading-tight">
              <span className="flex items-center gap-1 font-semibold text-white">
                <Star className="h-3.5 w-3.5 fill-brand-400 text-brand-400" />
                4.9 average rating
              </span>
              <span className="text-ink-400">from 2,300+ vehicle owners</span>
            </div>
          </div>

          <ul className="mt-10 space-y-5">
            {POINTS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-3.5">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-brand-300 shadow-inset backdrop-blur">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-sm text-ink-400">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}