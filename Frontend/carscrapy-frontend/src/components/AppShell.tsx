import { cn } from '@/lib/cn'
import { currentUser } from '@/lib/token'
import { useAuth } from '@/lib/auth'
import { Logo } from '@/features/auth/AuthLayout'
import type { LucideIcon } from 'lucide-react'
import { LogOut, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Match this route exactly (used for index routes). */
  end?: boolean
}

interface AppShellProps {
  /** Sidebar navigation for the current portal. */
  nav: NavItem[]
  /** Portal label shown above the nav, e.g. "Customer" / "Super admin". */
  portalName: string
  /** Optional extra content in the top bar (e.g. a status toggle). */
  headerExtra?: ReactNode
  /** Accent used for the active state; lets each portal feel distinct. */
  accent?: 'brand' | 'ink' | 'sky'
  children?: never
}

const ACCENTS = {
  brand: { active: 'bg-brand-50 text-brand-700', bar: 'bg-brand-600', ring: 'text-brand-600' },
  sky: { active: 'bg-sky-50 text-sky-700', bar: 'bg-sky-600', ring: 'text-sky-600' },
  ink: { active: 'bg-ink-100 text-ink-900', bar: 'bg-ink-900', ring: 'text-ink-700' },
} as const

/** Shared sidebar markup — rendered in the desktop rail and the mobile drawer. */
function SidebarContent({
  initials,
  username,
  role,
  nav,
  portalName,
  accent,
  onNavigate,
}: {
  initials: string
  username: string
  role: string
  nav: NavItem[]
  portalName: string
  accent: keyof typeof ACCENTS
  onNavigate?: () => void
}) {
  const { signOut } = useAuth()
  const tone = ACCENTS[accent]

  return (
    <>
      <div className="flex h-16 items-center border-b border-ink-200/80 px-5">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <p className="px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">
          {portalName}
        </p>
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                isActive ? tone.active : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'absolute left-0 top-1/2 h-5 -translate-y-1/2 rounded-r-full transition-all',
                    tone.bar,
                    isActive ? 'w-1 opacity-100' : 'w-0 opacity-0',
                  )}
                />
                <Icon
                  className={cn(
                    'h-4 w-4 transition',
                    isActive ? tone.ring : 'text-ink-400 group-hover:text-ink-600',
                  )}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-ink-200/80 p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-gradient text-xs font-bold text-white shadow-brand">
            {initials}
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink-900">{username}</p>
            <p className="truncate text-xs text-ink-500">{role}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </>
  )
}

/** Role-aware application shell shared by all four portals. */
export function AppShell({ nav, portalName, headerExtra, accent = 'brand' }: AppShellProps) {
  const { user, isGuest, signOut } = useAuth()
  const decoded = user ?? currentUser()
  const initials = (decoded?.username ?? '?').slice(0, 2).toUpperCase()
  const username = decoded?.username ?? 'Unknown'
  const role = decoded?.role ?? 'USER'
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => setMenuOpen(false), [location.pathname])

  const current = nav.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)))
  const sidebarProps = { initials, username, role, nav, portalName, accent }

  return (
    <div className="flex min-h-screen bg-ink-50">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-ink-200/80 bg-white lg:flex">
        <SidebarContent {...sidebarProps} />
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col bg-white shadow-2xl animate-fade-up [animation-duration:0.28s]">
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 grid h-8 w-8 place-items-center rounded-lg text-ink-500 hover:bg-ink-100"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent {...sidebarProps} onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ink-200/70 px-4 lg:px-8">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="-ml-1 grid h-9 w-9 place-items-center rounded-lg text-ink-600 hover:bg-ink-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="lg:hidden">
            <Logo />
          </div>

          <div className="hidden min-w-0 items-center gap-2 text-sm lg:flex">
            <span className="truncate font-semibold text-ink-900">{current?.label ?? portalName}</span>
            <span className="text-ink-300">/</span>
            <span className="shrink-0 text-ink-500">{portalName}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {headerExtra}
            {isGuest && (
              <span className="pill border-amber-200 bg-amber-50 font-semibold text-amber-800">
                Guest
              </span>
            )}
            <span className="pill hidden border-ink-200 bg-white text-ink-600 sm:inline-flex">
              {role}
            </span>
            <button
              onClick={signOut}
              className="grid h-9 w-9 place-items-center rounded-full bg-brand-gradient text-[11px] font-bold text-white shadow-brand lg:hidden"
              aria-label="Sign out"
            >
              {initials}
            </button>
            <span className="hidden h-9 w-9 place-items-center rounded-full bg-brand-gradient text-[11px] font-bold text-white shadow-brand lg:grid">
              {initials}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}