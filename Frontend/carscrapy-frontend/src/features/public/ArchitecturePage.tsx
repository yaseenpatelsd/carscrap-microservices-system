import { Button } from '@/components/ui/Button'
import { AUTHOR } from '@/features/public/PublicLayout'
import {
  ArrowRight,
  Boxes,
  Cloud,
  Container,
  Database,
  Github,
  Globe,
  KeyRound,
  Layers,
  Lock,
  Network,
  RefreshCcw,
  Server,
  ShieldCheck,
  Users,
  Workflow,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const SERVICES: {
  name: string
  role: string
  icon: LucideIcon
  points: string[]
}[] = [
  {
    name: 'API Gateway',
    role: 'Single entry point',
    icon: Workflow,
    points: ['Routes frontend requests', 'Gateway-level security', 'Forwards to services via Eureka'],
  },
  {
    name: 'Eureka Server',
    role: 'Service discovery',
    icon: Network,
    points: ['Registers running services', 'No hardcoded addresses', 'Enables dynamic scaling'],
  },
  {
    name: 'Auth Service',
    role: 'Identity & access',
    icon: KeyRound,
    points: ['Registration & login', 'OTP verification', 'JWT generation + roles'],
  },
  {
    name: 'Car Service',
    role: 'Valuation engine',
    icon: Layers,
    points: ['Vehicle information', 'Scrap price estimation', 'Eligibility rules'],
  },
  {
    name: 'Yard Service',
    role: 'Yard directory',
    icon: Globe,
    points: ['Yard records', 'Search by city/state/pincode', 'Status management'],
  },
  {
    name: 'Booking Service',
    role: 'Appointments',
    icon: Server,
    points: ['Create bookings', 'Reschedule & cancel', 'Assign staff per yard'],
  },
  {
    name: 'Email Service',
    role: 'Notifications',
    icon: RefreshCcw,
    points: ['Verification emails', 'Application notifications', 'Decoupled delivery'],
  },
]

const SECURITY = [
  'JWT-based authentication',
  'Spring Security',
  'BCrypt password hashing',
  'Role-Based Access Control',
  'OTP account verification',
  'Stateless authentication',
  'Protected REST APIs',
]

const ROLES = [
  { role: 'SUPER_ADMIN', purpose: 'System-wide administration' },
  { role: 'ADMIN', purpose: 'Manages yard & operations' },
  { role: 'STAFF', purpose: 'Handles appointments' },
  { role: 'USER', purpose: 'Customer using the platform' },
  { role: 'GUEST', purpose: 'Temporary, no-signup access' },
]

const STACK_GROUPS = [
  { title: 'Backend', icon: Server, items: ['Java 21', 'Spring Boot', 'Spring Cloud', 'Spring Security', 'Spring Data JPA', 'Hibernate'] },
  { title: 'Microservices', icon: Network, items: ['API Gateway', 'Eureka', 'OpenFeign', 'Resilience4j'] },
  { title: 'Data', icon: Database, items: ['MySQL', 'JPA entities', 'Transactions'] },
  { title: 'Frontend (outsourced)', icon: Boxes, items: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'] },
  { title: 'DevOps', icon: Container, items: ['Docker', 'Docker Compose', 'NGINX', 'Linux (Ubuntu)'] },
  { title: 'Cloud', icon: Cloud, items: ['AWS EC2', 'HTTPS / TLS', 'Reverse proxy'] },
]

export function ArchitecturePage() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-ink-200/70 bg-white">
        <div aria-hidden className="absolute -left-24 -top-24 h-[28rem] w-[28rem] animate-blob rounded-full bg-brand-200/30 blur-3xl" />
        <div className="relative mx-auto w-full max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="pill border-brand-200 bg-brand-50 text-brand-700">
              <Layers className="h-3.5 w-3.5" />
              System design
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-ink-950 sm:text-5xl">
              How CarScrapy is built
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-600">
              The backend is split into focused Spring Boot microservices instead of one large
              application. Eureka handles discovery, OpenFeign powers calls between services,
              Resilience4j keeps failures contained, and the whole stack runs in Docker on AWS.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={AUTHOR.github} target="_blank" rel="noreferrer noopener">
                <Button className="px-5 py-3">
                  <Github className="h-4 w-4" />
                  Browse the code
                </Button>
              </a>
              <a href={AUTHOR.live} target="_blank" rel="noreferrer noopener">
                <Button variant="ghost" className="px-5 py-3">
                  <Globe className="h-4 w-4" />
                  See it live
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Diagram */}
      <section className="mx-auto w-full max-w-6xl px-5 py-14 lg:px-8">
        <div className="card overflow-hidden p-0">
          <div className="flex items-center gap-2 border-b border-ink-200/60 bg-ink-950 px-4 py-3">
            <Network className="h-4 w-4 text-brand-300" />
            <span className="text-xs font-medium text-ink-300">Request flow · edge to service</span>
          </div>
          <pre className="overflow-x-auto bg-ink-950 p-5 text-[11px] leading-relaxed text-ink-300 sm:text-xs">
{`                         ┌───────────────────┐
                         │      Browser      │
                         │   React Frontend  │
                         └─────────┬─────────┘
                                   │  HTTPS
                                   ▼
                         ┌───────────────────┐
                         │       NGINX       │
                         │   Reverse Proxy   │
                         └─────────┬─────────┘
                                   ▼
                         ┌───────────────────┐
                         │   API Gateway     │
                         │  Spring Cloud GW  │
                         └─────────┬─────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
       ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
       │    Auth     │      │     Car     │      │    Yard     │
       │   Service   │      │   Service   │      │   Service   │
       └─────────────┘      └─────────────┘      └─────────────┘
              └────────────────────┼────────────────────┘
                                   ▼
                         ┌───────────────────┐
                         │ Booking Service   │
                         └─────────┬─────────┘
                                   ▼
                         ┌───────────────────┐
                         │  Email Service    │
                         └───────────────────┘

                         ┌───────────────────┐
                         │   Eureka Server   │  ← service discovery
                         └───────────────────┘`}
          </pre>
        </div>
      </section>

      {/* Services */}
      <section className="border-y border-ink-200/70 bg-white">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow">Services</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-950">
              Seven focused services
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              Each service owns a single responsibility and can be built, deployed and scaled
              independently.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ name, role, icon: Icon, points }) => (
              <article key={name} className="card card-hover group p-6">
                <div className="flex items-center gap-3">
                  <span className="icon-tile h-10 w-10 transition group-hover:bg-brand-gradient group-hover:text-white group-hover:ring-transparent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-ink-900">{name}</h3>
                    <p className="text-xs text-ink-400">{role}</p>
                  </div>
                </div>
                <ul className="mt-4 space-y-1.5">
                  {points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-xs text-ink-600">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Security + Roles */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="card p-7">
            <div className="flex items-center gap-3">
              <span className="icon-tile h-11 w-11">
                <Lock className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-bold tracking-tight text-ink-950">
                Security & authentication
              </h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-500">
              No server-side sessions. After login, the client receives a JWT that is sent with
              protected requests and validated by Spring Security at the edge.
            </p>

            <div className="mt-5 overflow-hidden rounded-xl border border-ink-200/70 bg-ink-950 p-4">
              <pre className="overflow-x-auto text-[11px] leading-relaxed text-ink-300">
{`User ─▶ Login ─▶ Auth Service
                       │ validate credentials
                       ▼
                  JWT Token
                       │ Authorization: Bearer <token>
                       ▼
                 API Gateway ─▶ Service`}
              </pre>
            </div>

            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {SECURITY.map((s) => (
                <li key={s} className="flex items-center gap-2 text-xs font-medium text-ink-700">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand-500" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-7">
            <div className="flex items-center gap-3">
              <span className="icon-tile h-11 w-11">
                <Users className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-bold tracking-tight text-ink-950">Role-based access</h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-500">
              Five roles, each routed to its own portal. The frontend guards routes by role and the
              backend enforces the same rules on every protected endpoint.
            </p>
            <ul className="mt-5 divide-y divide-ink-100">
              {ROLES.map(({ role, purpose }) => (
                <li key={role} className="flex items-center justify-between gap-4 py-3">
                  <span className="pill border-brand-200 bg-brand-50 font-mono text-[11px] text-brand-700">
                    {role}
                  </span>
                  <span className="text-right text-xs text-ink-500">{purpose}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Resilience + comms */}
      <section className="border-y border-ink-200/70 bg-white">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow">Communication & resilience</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-950">
                Services that find and protect each other
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                Eureka means services never depend on fixed IPs. OpenFeign makes inter-service calls
                declarative, and Resilience4j provides circuit breaking and fallbacks so one slow
                service can’t take down the rest.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <MiniFact icon={Network} label="Discovery" value="Eureka" />
                <MiniFact icon={Workflow} label="Comms" value="OpenFeign" />
                <MiniFact icon={ShieldCheck} label="Resilience" value="Resilience4j" />
              </div>
            </div>

            <div className="card overflow-hidden p-0">
              <div className="flex items-center gap-2 border-b border-ink-200/60 bg-ink-950 px-4 py-3">
                <Workflow className="h-4 w-4 text-brand-300" />
                <span className="text-xs font-medium text-ink-300">service-to-service lookup</span>
              </div>
              <pre className="overflow-x-auto bg-ink-950 p-5 text-[11px] leading-relaxed text-ink-300">
{`Booking Service
      │  "Where is Auth Service?"
      ▼
 Eureka Server
      │  service location
      ▼
 Auth Service
      │
      │  OpenFeign call (+ Resilience4j)
      ▼
   ✓ response`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">Technologies</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-950">Full stack</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STACK_GROUPS.map(({ title, icon: Icon, items }) => (
            <article key={title} className="card p-6">
              <div className="flex items-center gap-3">
                <span className="icon-tile h-10 w-10">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-base font-semibold text-ink-900">{title}</h3>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {items.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-ink-200 bg-ink-50/70 px-2.5 py-1 text-xs font-medium text-ink-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-8 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-ink-gradient p-8 shadow-card sm:p-12">
          <div aria-hidden className="absolute -right-20 -top-24 h-80 w-80 animate-blob rounded-full bg-brand-500/25 blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[1.4fr,1fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Explore the full implementation
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-300">
                Every service, the gateway config, the Docker setup and the React frontend are in one
                repository.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <a href={AUTHOR.github} target="_blank" rel="noreferrer noopener">
                <Button className="px-5 py-3">
                  <Github className="h-4 w-4" />
                  GitHub repo
                </Button>
              </a>
              <Link to="/about">
                <Button
                  variant="ghost"
                  className="border-white/15 bg-white/5 px-5 py-3 text-white hover:border-white/25 hover:bg-white/10 hover:text-white"
                >
                  About the author
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function MiniFact({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-ink-200/70 bg-ink-50/60 p-3">
      <span className="icon-tile h-9 w-9 shrink-0">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-ink-400">{label}</p>
        <p className="truncate text-sm font-semibold text-ink-800">{value}</p>
      </div>
    </div>
  )
}
