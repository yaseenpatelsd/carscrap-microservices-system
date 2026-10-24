import { Logo } from '@/features/auth/AuthLayout'
import { useAuth, homeForRole } from '@/lib/auth'
import { cn } from '@/lib/cn'
import { Github, Linkedin, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

export const AUTHOR = {
  name: 'Yaseen Patel',
  role: 'Java Backend Developer',
  github: 'https://github.com/yaseenpatelsd/carscrap-microservices-system',
  githubProfile: 'https://github.com/yaseenpatelsd',
  linkedin: 'https://www.linkedin.com/in/yaseen-patel-65099b3a8',
  repoName: 'yaseenpatelsd/carscrap-microservices-system',
  live: 'https://carscrapy.online',
} as const

const NAV = [
  { to: '/home', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/architecture', label: 'Architecture' },
]

/** Public marketing chrome shared by the landing, about and architecture pages. */
export function PublicLayout() {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location.pathname])

  return (
    <div className="flex min-h-screen flex-col bg-ink-50">
      <header
        className={cn(
          'sticky top-0 z-40 border-b transition-all duration-300',
          scrolled
            ? 'glass border-ink-200/70 shadow-[0_1px_0_0_rgba(15,18,24,0.04)]'
            : 'border-transparent bg-transparent',
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-5 lg:px-8">
          <Link to="/home" className="shrink-0" aria-label="CarScrapy home">
            <Logo />
          </Link>

          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition',
                    isActive ? 'text-brand-700' : 'text-ink-600 hover:bg-ink-100/70 hover:text-ink-900',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <a
              href={AUTHOR.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn profile"
              className="hidden h-9 w-9 place-items-center rounded-lg text-ink-500 transition hover:bg-ink-100 hover:text-ink-900 sm:grid"
            >
              <Linkedin className="h-[18px] w-[18px]" />
            </a>
            <a
              href={AUTHOR.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub repository"
              className="hidden h-9 w-9 place-items-center rounded-lg text-ink-500 transition hover:bg-ink-100 hover:text-ink-900 sm:grid"
            >
              <Github className="h-[18px] w-[18px]" />
            </a>

            <Link
              to={isAuthenticated ? homeForRole(role) : '/login'}
              className="btn-primary hidden px-4 py-2 text-[13px] sm:inline-flex"
            >
              {isAuthenticated ? 'Open dashboard' : 'Sign in'}
            </Link>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="grid h-9 w-9 place-items-center rounded-lg text-ink-600 hover:bg-ink-100 md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-ink-200/70 bg-white px-5 py-3 animate-fade-in md:hidden">
            <nav className="flex flex-col">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-3 py-2.5 text-sm font-medium',
                      isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-ink-50',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link
                to={isAuthenticated ? homeForRole(role) : '/login'}
                className="btn-primary mt-2"
              >
                {isAuthenticated ? 'Open dashboard' : 'Sign in'}
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <SiteFooter />
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-ink-200/70 bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-10 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-500">
            A vehicle scrap valuation and yard booking platform with a Spring Boot microservices
            backend, containerized with Docker and deployed on AWS.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <SocialLink href={AUTHOR.github} label="Source on GitHub">
              <Github className="h-4 w-4" />
              Source code
            </SocialLink>
            <SocialLink href={AUTHOR.linkedin} label="LinkedIn">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </SocialLink>
          </div>
        </div>

        <FooterCol title="Product">
          <FooterLink to="/home">Home</FooterLink>
          <FooterLink to="/about">About</FooterLink>
          <FooterLink to="/architecture">Architecture</FooterLink>
          <FooterLink to="/login">Sign in</FooterLink>
          <FooterLink to="/register">Create account</FooterLink>
        </FooterCol>

        <FooterCol title="Project">
          <FooterLink to="/about">About the developer</FooterLink>
          <ExternalLink href={AUTHOR.github}>GitHub repository</ExternalLink>
          <ExternalLink href={AUTHOR.live}>Live site</ExternalLink>
        </FooterCol>
      </div>

      <div className="border-t border-ink-200/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-ink-400 sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} CarScrapy · Built by {AUTHOR.name}</p>
          <p>Java · Spring Boot · Docker · AWS</p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-3.5 py-2 text-sm font-medium text-ink-700 shadow-xs transition hover:border-ink-300 hover:bg-ink-50 hover:text-ink-900"
    >
      {children}
    </a>
  )
}

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">{title}</p>
      <ul className="mt-3 space-y-2">{children}</ul>
    </div>
  )
}

function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <li>
      <Link to={to} className="text-sm text-ink-600 transition hover:text-brand-700">
        {children}
      </Link>
    </li>
  )
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="text-sm text-ink-600 transition hover:text-brand-700"
      >
        {children}
      </a>
    </li>
  )
}
