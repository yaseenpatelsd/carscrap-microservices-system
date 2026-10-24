import { Button } from '@/components/ui/Button'
import { useAuth, homeForRole } from '@/lib/auth'
import { AUTHOR } from '@/features/public/PublicLayout'
import {
  ArrowRight,
  BadgeIndianRupee,
  CalendarCheck,
  CheckCircle2,
  Coins,
  Container,
  Database,
  Github,
  Globe,
  LayoutDashboard,
  Search,
  Shield,
  Sparkles,
  TrendingUp,
  Workflow,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: BadgeIndianRupee,
    title: 'Instant scrap valuation',
    body: 'A rule-based pricing engine estimates a vehicle’s scrap value in seconds from type, fuel, year and city.',
  },
  {
    icon: Search,
    title: 'Certified yard discovery',
    body: 'Search verified recyclers by name, city, state or pincode and pick the yard that suits you.',
  },
  {
    icon: CalendarCheck,
    title: 'End-to-end booking',
    body: 'Book an inspection, then track, postpone or cancel — with staff assignment handled per yard.',
  },
  {
    icon: Shield,
    title: 'JWT & role-based access',
    body: 'Five roles from guest to super-admin, secured by Spring Security with stateless JWT auth and OTP verification.',
  },
  {
    icon: Coins,
    title: 'Metal price control',
    body: 'Super-admins maintain live metal prices that feed the valuation engine across every yard.',
  },
  {
    icon: LayoutDashboard,
    title: 'Five role-based portals',
    body: 'Purpose-built interfaces for customers, staff, admins and super-admins — all backed by the same APIs.',
  },
]

const STACK = [
  { label: 'Java 21', group: 'Backend' },
  { label: 'Spring Boot', group: 'Backend' },
  { label: 'Spring Cloud', group: 'Backend' },
  { label: 'Eureka', group: 'Discovery' },
  { label: 'OpenFeign', group: 'Comms' },
  { label: 'Resilience4j', group: 'Resilience' },
  { label: 'Spring Security', group: 'Security' },
  { label: 'JWT', group: 'Security' },
  { label: 'MySQL', group: 'Data' },
  { label: 'Hibernate / JPA', group: 'Data' },
  { label: 'Docker', group: 'DevOps' },
  { label: 'NGINX', group: 'DevOps' },
  { label: 'AWS EC2', group: 'Cloud' },
] as const

const SERVICES = [
  { name: 'API Gateway', role: 'Routing & security' },
  { name: 'Eureka Server', role: 'Service discovery' },
  { name: 'Auth Service', role: 'JWT, OTP, roles' },
  { name: 'Car Service', role: 'Valuation engine' },
  { name: 'Yard Service', role: 'Yard directory' },
  { name: 'Booking Service', role: 'Appointments' },
  { name: 'Email Service', role: 'Notifications' },
]

export function LandingPage() {
  const { isAuthenticated, role } = useAuth()
  const primaryTo = isAuthenticated ? homeForRole(role) : '/register'
  const primaryLabel = isAuthenticated ? 'Open dashboard' : 'Get started free'

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -right-24 -top-32 h-[34rem] w-[34rem] animate-blob rounded-full bg-brand-300/25 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -left-32 top-24 h-[26rem] w-[26rem] animate-blob rounded-full bg-emerald-300/20 blur-3xl [animation-delay:4s]"
        />

        <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-16 lg:px-8 lg:pb-24 lg:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="pill mx-auto border-brand-200 bg-brand-50 text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              Spring Boot microservices · Docker · AWS
            </p>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-ink-950 sm:text-5xl lg:text-6xl">
              Turn your old car into value,
              <span className="block bg-brand-gradient bg-clip-text text-transparent">
                not a headache.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">
              CarScrapy estimates your vehicle’s scrap value in seconds, connects you with certified
              recyclers, and books the inspection — all in one production-grade platform.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to={primaryTo}>
                <Button className="px-6 py-3.5">
                  {primaryLabel}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href={AUTHOR.github} target="_blank" rel="noreferrer noopener">
                <Button variant="ghost" className="px-6 py-3.5">
                  <Github className="h-4 w-4" />
                  View source
                </Button>
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-ink-500">
              {['No account needed to try', '5 role-based portals', 'Deployed on AWS'].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-500" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Architecture strip */}
          <div className="relative mx-auto mt-14 max-w-4xl">
            <div className="glass overflow-hidden rounded-3xl border border-ink-200/70 shadow-card">
              <div className="flex items-center gap-2 border-b border-ink-200/60 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs font-medium text-ink-400">
                  carscrapy.online — system overview
                </span>
              </div>
              <div className="grid gap-3 p-4 sm:grid-cols-3 lg:p-5">
                <OverviewTile icon={Globe} label="Public entry" value="NGINX + HTTPS" tone="brand" />
                <OverviewTile icon={Workflow} label="Gateway" value="Spring Cloud GW" tone="sky" />
                <OverviewTile icon={Database} label="Persistence" value="MySQL · JPA" tone="amber" />
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-ink-200/60 p-4 sm:grid-cols-4 lg:p-5">
                {SERVICES.slice(0, 4).map((s) => (
                  <div
                    key={s.name}
                    className="rounded-xl border border-ink-200/70 bg-white/70 px-3 py-2.5 text-center"
                  >
                    <p className="text-xs font-semibold text-ink-800">{s.name}</p>
                    <p className="mt-0.5 text-[11px] text-ink-400">{s.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">What it does</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
            Everything a scrap platform needs
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-500 sm:text-base">
            One coherent product across valuation, discovery, booking and administration — with the
            backend split into focused microservices.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <article key={title} className="card card-hover group p-6">
              <span className="icon-tile h-11 w-11 transition group-hover:bg-brand-gradient group-hover:text-white group-hover:ring-transparent">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-ink-900">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Architecture band */}
      <section className="border-y border-ink-200/70 bg-white">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow">Under the hood</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-950">
                A real microservices backend
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                Rather than one monolith, each concern is its own Spring Boot service. Eureka handles
                discovery, OpenFeign powers inter-service calls, Resilience4j keeps failures
                contained, and everything ships in Docker.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {SERVICES.map((s) => (
                  <div key={s.name} className="rounded-xl border border-ink-200/70 bg-ink-50/60 p-3">
                    <p className="text-xs font-semibold text-ink-800">{s.name}</p>
                    <p className="mt-0.5 text-[11px] text-ink-400">{s.role}</p>
                  </div>
                ))}
              </div>

              <Link to="/architecture" className="mt-6 inline-flex">
                <Button variant="ghost">
                  Explore the architecture
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="card overflow-hidden rounded-2xl p-0">
                <div className="flex items-center gap-2 border-b border-ink-200/60 bg-ink-950 px-4 py-3">
                  <Container className="h-4 w-4 text-brand-300" />
                  <span className="text-xs font-medium text-ink-300">docker compose up --build</span>
                </div>
                <pre className="overflow-x-auto bg-ink-950 p-4 text-[11px] leading-relaxed text-ink-300">
{`Browser  ──HTTPS──▶  NGINX  ──▶  API Gateway
                                    │
        ┌───────────┬───────────────┼──────────────┐
        ▼           ▼               ▼              ▼
      Auth        Car            Yard          Booking
        │           │               │              │
        └───────────┴──── Eureka ───┴──────────────┘
                                    │
                              Email Service`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Tech stack</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
            Built on a battle-tested stack
          </h2>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {STACK.map((t) => (
            <span
              key={t.label}
              className="pill border-ink-200 bg-white text-ink-700 shadow-xs transition hover:border-brand-300 hover:text-brand-700"
            >
              <span className="text-ink-300">{t.group}</span>
              <span className="font-semibold">{t.label}</span>
            </span>
          ))}
        </div>
      </section>

      {/* Author + CTA */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-4 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-ink-gradient p-8 shadow-card sm:p-12">
          <div aria-hidden className="absolute -right-20 -top-24 h-80 w-80 animate-blob rounded-full bg-brand-500/25 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow text-brand-300">Meet the developer</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {AUTHOR.name}
              </h2>
              <p className="mt-2 text-base font-medium text-brand-200">{AUTHOR.role}</p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-300">
                I designed and built the entire microservices backend — seven Spring Boot services,
                plus the Docker setup and AWS deployment. The React frontend was delivered by an
                outsourced team. The backend source is open on GitHub.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/about">
                  <Button className="px-5 py-3">
                    Read my story
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href={AUTHOR.githubProfile} target="_blank" rel="noreferrer noopener">
                  <Button
                    variant="ghost"
                    className="border-white/15 bg-white/5 px-5 py-3 text-white hover:border-white/25 hover:bg-white/10 hover:text-white"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </Button>
                </a>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <DarkStat icon={Sparkles} label="Roles supported" value="5" />
              <DarkStat icon={Container} label="Backend services" value="7" />
              <DarkStat icon={TrendingUp} label="Architecture" value="Microservices" />
              <DarkStat icon={Globe} label="Deployment" value="AWS EC2" />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto w-full max-w-3xl px-5 py-16 text-center lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-ink-950">
          Try CarScrapy in under a minute
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-500">
          Create an account, or jump straight in as a guest — no signup required to explore.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to={primaryTo}>
            <Button className="px-6 py-3.5">
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="ghost" className="px-6 py-3.5">
              About the project
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

function OverviewTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Globe
  label: string
  value: string
  tone: 'brand' | 'sky' | 'amber'
}) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600 ring-brand-100',
    sky: 'bg-sky-50 text-sky-600 ring-sky-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
  } as const
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-ink-200/70 bg-white p-4">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-ink-400">{label}</p>
        <p className="truncate text-sm font-semibold text-ink-900">{value}</p>
      </div>
    </div>
  )
}

function DarkStat({ icon: Icon, label, value }: { icon: typeof Globe; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <Icon className="h-5 w-5 text-brand-300" />
      <p className="mt-3 text-lg font-bold text-white">{value}</p>
      <p className="text-xs text-ink-400">{label}</p>
    </div>
  )
}
