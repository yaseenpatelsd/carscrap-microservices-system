import { yardApi } from '@/api/yard'
import { Button } from '@/components/ui/Button'
import { Loading, PageHeader } from '@/components/ui/Feedback'
import { label, yardTone } from '@/types/enums'
import type { YardStatus } from '@/types/api'
import { useAuth } from '@/lib/auth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowRight, Calendar, Power, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { toastError } from '@/lib/toast'

/** STAFF overview. */
export function StaffDashboardPage() {
  const { user } = useAuth()
  const qc = useQueryClient()

  const live = useQuery({
    queryKey: ['yard', 'live-status'],
    queryFn: () => yardApi.changeStatusByManagement(),
  })

  const toggle = useMutation({
    mutationFn: () => yardApi.changeStatusByManagement(),
    onSuccess: (res) => {
      toast.success(`Yard is now ${label(res.status ?? '')}`)
      qc.invalidateQueries({ queryKey: ['yard', 'live-status'] })
    },
    onError: (e) => toastError(e),
  })

  const status = (live.data?.status ?? 'ACTIVE') as YardStatus

  return (
    <div className="animate-fade-up">
      <section className="relative overflow-hidden rounded-3xl bg-ink-gradient p-6 shadow-card sm:p-8">
        <div aria-hidden className="absolute -right-16 -top-20 h-72 w-72 animate-blob rounded-full bg-ink-500/20 blur-3xl" />
        <div className="relative">
          <p className="eyebrow text-ink-300">Staff workspace</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Hello, {user?.username}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-300">
            Manage your yard&apos;s availability and work through the appointments assigned to you.
          </p>
        </div>
      </section>

      <section className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <div className="flex items-center gap-3.5">
            <span className="icon-tile h-10 w-10">
              <Power className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink-900">Yard status</p>
              {live.isLoading ? (
                <p className="text-xs text-ink-400">Checking…</p>
              ) : (
                <span
                  className={`pill mt-1 ${yardTone(status)}`}
                >
                  {label(status)}
                </span>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            className="mt-4"
            loading={toggle.isPending}
            onClick={() => toggle.mutate()}
          >
            <RefreshCw className="h-4 w-4" />
            Toggle open / closed
          </Button>
        </div>

        <Link to="/staff/appointments" className="card card-hover group flex items-start justify-between gap-4 p-5">
          <div>
            <span className="icon-tile h-10 w-10">
              <Calendar className="h-5 w-5" />
            </span>
            <h3 className="mt-3 text-sm font-semibold text-ink-900">My appointments</h3>
            <p className="mt-1 text-sm text-ink-500">
              Search your assigned bookings and update their progress.
            </p>
          </div>
          <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 -translate-x-1 text-ink-500 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
        </Link>
      </section>
    </div>
  )
}

/** STAFF — own yard status screen. */
export function StaffYardPage() {
  const qc = useQueryClient()

  const live = useQuery({
    queryKey: ['yard', 'live-status'],
    queryFn: () => yardApi.changeStatusByManagement(),
  })

  const toggle = useMutation({
    mutationFn: () => yardApi.changeStatusByManagement(),
    onSuccess: (res) => {
      toast.success(`Yard is now ${label(res.status ?? '')}`)
      qc.invalidateQueries({ queryKey: ['yard', 'live-status'] })
    },
    onError: (e) => toastError(e),
  })

  const status = (live.data?.status ?? 'ACTIVE') as YardStatus

  return (
    <div className="mx-auto max-w-xl animate-fade-up">
      <PageHeader
        eyebrow="Yard"
        title="My yard"
        subtitle="Open or close the yard for bookings."
      />

      {live.isLoading ? (
        <Loading label="Loading yard status…" />
      ) : (
        <div className="card p-5">
          <p className="text-sm font-semibold text-ink-900">Operating status</p>
          <span
            className={`pill mt-2 ${yardTone(status)}`}
          >
            {label(status)}
          </span>
          <p className="mt-3 text-sm text-ink-500">
            Toggling updates the yard immediately for customers searching for recyclers.
          </p>
          <Button className="mt-5" loading={toggle.isPending} onClick={() => toggle.mutate()}>
            <RefreshCw className="h-4 w-4" />
            Toggle open / closed
          </Button>
        </div>
      )}
    </div>
  )
}