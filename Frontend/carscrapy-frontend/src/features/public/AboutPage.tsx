import { Button } from '@/components/ui/Button'
import { AUTHOR } from '@/features/public/PublicLayout'
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  Cloud,
  Code2,
  Container,
  Cpu,
  Database,
  Github,
  Globe,
  Layers,
  Linkedin,
  MapPin,
  Network,
  Server,
  ShieldCheck,
  Sparkles,
  Waypoints,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const HIGHLIGHTS = [
  { icon: Server, value: '7', label: 'Backend microservices' },
  { icon: ShieldCheck, value: '5', label: 'Role-based access levels' },
  { icon: Container, value: '100%', label: 'Dockerized backend' },
  { icon: Cloud, value: 'AWS', label: 'EC2 deployment' },
] as const

const SKILLS: { group: string; icon: LucideIcon; items: string[] }[] = [
  {
    group: 'Core backend',
    icon: Cpu,
    items: [
      'Java 21',
      'Spring Boot',
      'Spring Cloud',
      'Spring Security',
      'Spring Data JPA',
      'Hibernate',
      'REST APIs',
    ],
  },
  {
    group: 'Microservices',
    icon: Network,
    items: [
      'API Gateway',
      'Eureka (discovery)',
      'OpenFeign',
      'Resilience4j',
      'Domain decomposition',
      'Centralised config',
    ],
  },
  {
    group: 'Data & persistence',
    icon: Database,
    items: ['MySQL', 'SQL', 'Schema design', 'JPA relationships', 'Transactions', 'Query tuning'],
  },
  {
    group: 'Security',
    icon: ShieldCheck,
    items: ['JWT', 'Spring Security', 'BCrypt hashing', 'Role-Based Access Control', 'OTP verification', 'Stateless auth'],
  },
  {
    group: 'DevOps & Cloud',
    icon: Container,
    items: ['Docker', 'Docker Compose', 'NGINX', 'AWS EC2', 'HTTPS / TLS', 'Linux (Ubuntu)'],
  },
  {
    group: 'Engineering practices',
    icon: Waypoints,
    items: ['Clean layering', 'API design', 'Error handling', 'Service contracts', 'Git & GitHub'],
  },
]

const JOURNEY = [
  {
    icon: BriefcaseBusiness,
    title: 'Backend architecture & services',
    meta: 'Java 21 · Spring Boot',
    body: 'Designed and built the entire CarScrapy backend: decomposed the domain into seven focused services, defined the REST contracts each exposes, and implemented the business logic for valuation, yard management and bookings.',
  },
  {
    icon: Network,
    title: 'Microservices & inter-service comms',
    meta: 'Eureka · OpenFeign · Resilience4j',
    body: 'Set up service discovery with Eureka, wired declarative service-to-service calls with OpenFeign, and added Resilience4j circuit breakers so a single failing service cannot cascade across the platform.',
  },
  {
    icon: ShieldCheck,
    title: 'Security & identity',
    meta: 'Spring Security · JWT · RBAC',
    body: 'Implemented stateless JWT authentication, BCrypt password hashing, OTP-based account verification and role-based access control across five roles — enforced at both the gateway and each service.',
  },
  {
    icon: Cloud,
    title: 'Containerisation & deployment',
    meta: 'Docker · NGINX · AWS',
    body: 'Containerized every service, orchestrated the backend with Docker Compose, and deployed it to an AWS EC2 instance behind NGINX terminating HTTPS before forwarding to the API Gateway.',
  },
]

const PROJECT_FACTS = [
  { icon: Layers, label: 'Backend architecture', value: 'Spring Boot microservices' },
  { icon: Network, label: 'Discovery & comms', value: 'Eureka + OpenFeign' },
  { icon: ShieldCheck, label: 'Security', value: 'Spring Security, JWT, RBAC, OTP' },
  { icon: Database, label: 'Persistence', value: 'MySQL with JPA / Hibernate' },
  { icon: Container, label: 'Packaging', value: 'Docker & Docker Compose' },
  { icon: Globe, label: 'Edge & hosting', value: 'NGINX reverse proxy on AWS EC2' },
]

export function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Profile header */}
      <section className="relative overflow-hidden border-b border-ink-200/70 bg-white">
        <div
          aria-hidden
          className="absolute -right-24 -top-28 h-[30rem] w-[30rem] animate-blob rounded-full bg-brand-200/30 blur-3xl"
        />
        <div className="relative mx-auto w-full max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.4fr,1fr] lg:items-center">
            <div>
              <p className="pill border-brand-200 bg-brand-50 text-brand-700">
                <Sparkles className="h-3.5 w-3.5" />
                About the developer
              </p>

              <div className="mt-6 flex items-center gap-4">
                <Avatar name={AUTHOR.name} />
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">
                    {AUTHOR.name}
                  </h1>
                  <p className="mt-1 text-base font-medium text-brand-600">{AUTHOR.role}</p>
                </div>
              </div>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-600">
                I’m a <strong className="font-semibold text-ink-800">Java backend developer</strong>{' '}
                who builds production-grade systems with{' '}
                <strong className="font-semibold text-ink-800">Spring Boot</strong> and{' '}
                <strong className="font-semibold text-ink-800">microservices</strong>. I designed and
                built the entire CarScrapy backend — seven independently deployed services covering
                authentication, valuation, yards, bookings and notifications. The React frontend for
                this project was <strong className="font-semibold text-ink-800">outsourced</strong>;
                my work is focused on the backend, the API contracts and the deployment.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a href={AUTHOR.linkedin} target="_blank" rel="noreferrer noopener">
                  <Button className="px-5 py-3">
                    <Linkedin className="h-4 w-4" />
                    Connect on LinkedIn
                  </Button>
                </a>
                <a href={AUTHOR.github} target="_blank" rel="noreferrer noopener">
                  <Button variant="ghost" className="px-5 py-3">
                    <Github className="h-4 w-4" />
                    View the source
                  </Button>
                </a>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-ink-500">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-ink-400" />
                  India
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Code2 className="h-3.5 w-3.5 text-ink-400" />
                  Java · Spring Boot
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Network className="h-3.5 w-3.5 text-ink-400" />
                  Microservices
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Server className="h-3.5 w-3.5 text-ink-400" />
                  Backend-focused
                </span>
              </div>
            </div>

            {/* Repo card */}
            <RepoCard />
          </div>

          {/* Highlights */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {HIGHLIGHTS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="card p-4">
                <span className="icon-tile h-9 w-9">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="mt-3 text-xl font-bold tracking-tight text-ink-950">{value}</p>
                <p className="text-xs text-ink-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">Toolbox</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-950">Backend skills &amp; stack</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">
            The backend technologies I used to design, build, secure and deploy this platform. The
            React frontend was delivered by an outsourced team and is outside my scope here.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SKILLS.map(({ group, icon: Icon, items }) => (
            <article key={group} className="card p-6">
              <div className="flex items-center gap-3">
                <span className="icon-tile h-10 w-10">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-base font-semibold text-ink-900">{group}</h3>
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

      {/* Journey */}
      <section className="border-y border-ink-200/70 bg-white">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow">Experience</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-950">
              What I built on the backend
            </h2>
          </div>

          <div className="relative mt-10 space-y-6 before:absolute before:left-[19px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-ink-200 sm:space-y-8">
            {JOURNEY.map(({ icon: Icon, title, meta, body }) => (
              <div key={title} className="relative flex gap-5">
                <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white shadow-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="card flex-1 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-ink-900">{title}</h3>
                    <span className="pill border-brand-200 bg-brand-50 text-brand-700">{meta}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scope of ownership */}
      <section className="mx-auto w-full max-w-6xl px-5 pt-16 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">Scope</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-950">What I owned</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">
            This project had a clear split of responsibility. I owned the backend and deployment;
            the user interface was built by an outsourced frontend team.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <article className="card border-brand-200/70 p-6 ring-1 ring-brand-100">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-gradient text-white shadow-brand">
                <Server className="h-5 w-5" />
              </span>
              <h3 className="text-base font-semibold text-ink-900">Built by me (backend)</h3>
            </div>
            <ul className="mt-4 space-y-2.5">
              {[
                'All seven Spring Boot microservices and the API Gateway',
                'Service discovery (Eureka) and inter-service calls (OpenFeign)',
                'Authentication, JWT, OTP and role-based access control',
                'Domain logic for valuation, yards and bookings',
                'MySQL schema design with JPA / Hibernate',
                'Docker packaging, Compose orchestration and AWS deployment',
                'REST API contracts consumed by the frontend',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="card border-ink-200 p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-100 text-ink-500 ring-1 ring-inset ring-ink-200">
                <Globe className="h-5 w-5" />
              </span>
              <h3 className="text-base font-semibold text-ink-900">Outsourced (frontend)</h3>
            </div>
            <ul className="mt-4 space-y-2.5">
              {[
                'React + TypeScript UI delivered by an external team',
                'Consumes the REST APIs I designed and documented',
                'Runs against the gateway I configured and deployed',
                'Outside the scope of the backend work shown here',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-300" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-xl border border-ink-200 bg-ink-50/70 p-3.5 text-xs leading-relaxed text-ink-500">
              Shown here for completeness of the product — my contribution is the backend and the
              infrastructure it runs on.
            </p>
          </article>
        </div>
      </section>

      {/* Project facts */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr,1.2fr] lg:items-center">
          <div>
            <p className="eyebrow">The project</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-950">
              CarScrapy, in brief
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              A car scrap management platform with a backend deliberately split into focused Spring
              Boot services rather than a monolith, containerized with Docker and deployed to AWS
              behind NGINX. My scope was the backend; the frontend was outsourced.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/architecture">
                <Button className="px-5 py-3">
                  See the architecture
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href={AUTHOR.live} target="_blank" rel="noreferrer noopener">
                <Button variant="ghost" className="px-5 py-3">
                  <Globe className="h-4 w-4" />
                  Visit live site
                </Button>
              </a>
            </div>
          </div>

          <div className="card divide-y divide-ink-100 p-0">
            {PROJECT_FACTS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 px-5 py-4">
                <span className="icon-tile h-9 w-9 shrink-0">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-wide text-ink-400">{label}</p>
                  <p className="text-sm font-semibold text-ink-800">{value}</p>
                </div>
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-8 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-ink-gradient p-8 shadow-card sm:p-12">
          <div aria-hidden className="absolute -right-20 -top-24 h-80 w-80 animate-blob rounded-full bg-brand-500/25 blur-3xl" />
          <div className="relative text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5 text-brand-300 backdrop-blur">
              <Award className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-white">
              Let’s build something solid
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-300">
              Open to backend engineering work and collaboration. Reach out on LinkedIn, or dig into
              the code on GitHub.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a href={AUTHOR.linkedin} target="_blank" rel="noreferrer noopener">
                <Button className="px-5 py-3">
                  <Linkedin className="h-4 w-4" />
                  {AUTHOR.linkedin.replace('https://www.', '')}
                </Button>
              </a>
              <a href={AUTHOR.github} target="_blank" rel="noreferrer noopener">
                <Button
                  variant="ghost"
                  className="border-white/15 bg-white/5 px-5 py-3 text-white hover:border-white/25 hover:bg-white/10 hover:text-white"
                >
                  <Github className="h-4 w-4" />
                  {AUTHOR.repoName}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-xl font-bold text-white shadow-brand ring-4 ring-white">
      {initials}
    </span>
  )
}

function RepoCard() {
  return (
    <div className="card overflow-hidden p-0">
      <div className="flex items-center gap-2 border-b border-ink-200/60 bg-ink-950 px-4 py-3">
        <Github className="h-4 w-4 text-ink-300" />
        <span className="truncate text-xs font-medium text-ink-300">{AUTHOR.repoName}</span>
      </div>
      <div className="space-y-4 p-5">
        <p className="text-sm leading-relaxed text-ink-600">
          The repository holds the Spring Boot microservices backend I built — gateway, discovery,
          auth, car, yard, booking and email services. The React frontend lives alongside it and was
          delivered by an outsourced team.
        </p>
        <div className="flex flex-wrap gap-2">
          {['Java', 'Spring Boot', 'Spring Cloud', 'Docker', 'MySQL'].map((t) => (
            <span key={t} className="pill border-ink-200 bg-ink-50 text-ink-600">
              {t}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 border-t border-ink-100 pt-4 text-center">
          <Fact icon={Server} value="7" label="Services" />
          <Fact icon={ShieldCheck} value="5" label="Roles" />
          <Fact icon={Network} value="REST" label="APIs" />
        </div>
        <a href={AUTHOR.github} target="_blank" rel="noreferrer noopener" className="block">
          <Button variant="ghost" fullWidth>
            <Github className="h-4 w-4" />
            Open repository
          </Button>
        </a>
      </div>
    </div>
  )
}

function Fact({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) {
  return (
    <div>
      <Icon className="mx-auto h-4 w-4 text-brand-500" />
      <p className="mt-1.5 text-sm font-bold text-ink-900">{value}</p>
      <p className="text-[11px] text-ink-400">{label}</p>
    </div>
  )
}
