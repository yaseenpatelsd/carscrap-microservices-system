import { adminApi, staffApi } from '@/api/auth'
import { yardApi } from '@/api/yard'
import { StatCard } from '@/components/ui/StatCard'
import { useAuth } from '@/lib/auth'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Coins, ShieldPlus, Store, UserCog, UserPlus, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const MODULES = [
  { title: 'Add admin', body: 'Create and manage admin users.', to: '/super-admin/admins', icon: ShieldPlus },
  { title: 'Add staff', body: 'Register staff members for yard work.', to: '/super-admin/staff', icon: UserPlus },
  { title: 'Add yard', body: 'Add new scrapyard locations.', to: '/super-admin/yards/add', icon: Store },
  { title: 'Manage yards', body: 'Search, edit, assign admins and staff.', to: '/super-admin/yards', icon: UserCog },
  { title: 'Metal prices', body: 'Update scrap metal price values.', to: '/super-admin/metal', icon: Coins },
]

/** SUPER_ADMIN overview — mirrors the reference super-admin hero + cards. */
export function SuperAdminDashboardPage() {
  const { user } = useAuth()

  const admins = useQuery({ queryKey: ['admin', 'all'], queryFn: () => adminApi.getAll() })
  const staff = useQuery({ queryKey: ['staff', 'all'], queryFn: () => staffApi.getAll() })
  const yards = useQuery({ queryKey: ['yards', 'all-admin'], queryFn: () => yardApi.allForAdmin() })

  return (
    <div className="animate-fade-up">
      <section className="relative overflow-hidden rounded-3xl bg-ink-gradient p-6 shadow-card sm:p-8">
        <div aria-hidden className="absolute -right-16 -top-20 h-72 w-72 animate-blob rounded-full bg-brand-500/25 blur-3xl" />
        <div aria-hidden className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative">
          <p className="eyebrow text-brand-300">Platform dashboard</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Hello, {user?.username}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-300">
            Create admins, register yards, assign teams, and keep platform metal pricing up to date.
          </p>
        </div>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard label="Admin accounts" value={admins.data?.length ?? 0} icon={ShieldPlus} />
        <StatCard label="Staff members" value={staff.data?.length ?? 0} icon={Users} tone="sky" />
        <StatCard label="Scrap yards" value={yards.data?.length ?? 0} icon={Store} tone="amber" />
      </section>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-ink-400">
        Modules
      </h2>
      <section className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map(({ title, body, to, icon: Icon }) => (
          <Link key={to} to={to} className="card card-hover group block p-5">
            <span className="icon-tile h-11 w-11 transition group-hover:bg-brand-gradient group-hover:text-white group-hover:ring-transparent">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-ink-900">
              {title}
              <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-brand-500 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{body}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}