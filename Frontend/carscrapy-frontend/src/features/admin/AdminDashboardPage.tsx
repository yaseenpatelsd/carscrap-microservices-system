import { staffApi } from '@/api/auth'
import { yardApi } from '@/api/yard'
import { useAuth } from '@/lib/auth'
import { StatCard } from '@/components/ui/StatCard'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Calendar, Store, Users } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

const MODULES = [
  {
    title: 'Add staff',
    body: 'Create a new staff account for yard operations.',
    to: '/admin/staff/add',
  },
  {
    title: 'Manage staff',
    body: 'View and remove staff members assigned to your yard.',
    to: '/admin/staff',
  },
  {
    title: 'Manage yard',
    body: 'Edit contact details and yard availability.',
    to: '/admin/yard',
  },
  {
    title: 'Appointments',
    body: 'Search bookings and update appointment progress.',
    to: '/admin/appointments',
  },
]

/** ADMIN overview — mirrors the reference admin-dashboard hero + module cards. */
export function AdminDashboardPage() {
  const { user } = useAuth()

  const staff = useQuery({
    queryKey: ['staff', 'admin-list'],
    queryFn: () => staffApi.listForAdmin(),
  })

  const yards = useQuery({
    queryKey: ['yards', 'admin-owned'],
    queryFn: () => yardApi.allForAdmin(),
  })

  const ownYard = yards.data?.find((y) => y.managedBy) ?? yards.data?.[0]

  return (
    <div className="animate-fade-up">
      <section className="relative overflow-hidden rounded-3xl bg-ink-gradient p-6 shadow-card sm:p-8">
        <div aria-hidden className="absolute -right-16 -top-20 h-72 w-72 animate-blob rounded-full bg-sky-500/20 blur-3xl" />
        <div className="relative">
          <p className="eyebrow text-sky-300">Admin control centre</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Hello, {user?.username}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-300">
            Manage your yard&apos;s staff, contact details, availability, and customer appointments
            from one workspace.
          </p>
        </div>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard label="Staff in your yard" value={staff.data?.length ?? 0} icon={Users} tone="sky" />
        <StatCard label="Your yard" value={ownYard?.name ?? '—'} icon={Store} />
        <StatCard label="Open appointments" value="Search" hint="Under appointments" icon={Calendar} tone="amber" />
      </section>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-ink-400">
        Modules
      </h2>
      <section className="mt-3 grid gap-4 sm:grid-cols-2">
        {MODULES.map(({ title, body, to }) => (
          <Link key={to} to={to} className="card card-hover group flex items-start justify-between gap-4 p-5">
            <div>
              <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{body}</p>
            </div>
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 -translate-x-1 text-sky-600 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
          </Link>
        ))}
      </section>

      <div className="mt-6">
        <Link to="/admin/appointments">
          <Button variant="ghost">Go to appointments</Button>
        </Link>
      </div>
    </div>
  )
}