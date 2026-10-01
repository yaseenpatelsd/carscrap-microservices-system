import { adminApi } from '@/api/auth'
import { errorMessage } from '@/api/client'
import { Button } from '@/components/ui/Button'
import { EmptyState, Loading, PageHeader, ErrorState } from '@/components/ui/Feedback'
import { Field } from '@/components/ui/Field'
import type { AdminFlowResponse } from '@/types/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, Mail, ShieldPlus, User } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { toastError } from '@/lib/toast'

/** SUPER_ADMIN — create admin accounts and list existing ones.
 *  Mirrors POST /admin/register and GET /admin/getAll. */
export function SuperAdminAdminsPage() {
  const qc = useQueryClient()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [created, setCreated] = useState<AdminFlowResponse | null>(null)

  const admins = useQuery({
    queryKey: ['admin', 'all'],
    queryFn: () => adminApi.getAll(),
  })

  const create = useMutation({
    mutationFn: () => adminApi.register({ username, email, password }),
    onSuccess: (res) => {
      setCreated(res)
      toast.success('Admin created', { description: `${res.username} can now sign in.` })
      setUsername('')
      setEmail('')
      setPassword('')
      qc.invalidateQueries({ queryKey: ['admin', 'all'] })
    },
    onError: (e) => toastError(e),
  })

  function submit() {
    if (!username.trim()) return toast.error('Username is required')
    if (!email.trim()) return toast.error('Email is required')
    if (password.length < 8) return toast.error('Password must be at least 8 characters')
    setCreated(null)
    create.mutate()
  }

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Access"
        title="Admins"
        subtitle="Create admin accounts, then assign them to yards from the Scrap Yards screen."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        {/* Create form */}
        <section className="card p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-ink-900">Create an admin</h2>
          <p className="mt-1 text-sm text-ink-500">
            Admins manage a single yard: staff, contact details, and appointments.
          </p>

          <div className="mt-5 space-y-4">
            <Field label="Username" placeholder="admin_username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Field
              label="Email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Field
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button fullWidth loading={create.isPending} onClick={submit}>
              <ShieldPlus className="h-4 w-4" />
              Create admin
            </Button>
          </div>

          {created && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <div className="text-sm">
                <p className="font-semibold text-emerald-900">Admin created</p>
                <p className="mt-0.5 text-emerald-700">
                  {created.username} · {created.email}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Existing admins */}
        <section className="card p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-ink-900">Existing admins</h2>
          <p className="mt-1 text-sm text-ink-500">{admins.data?.length ?? 0} admin accounts.</p>

          <div className="mt-4">
            {admins.isLoading ? (
              <Loading label="Loading admins…" />
            ) : admins.isError ? (
              <ErrorState
            title="Could not load admins"
            body={errorMessage(admins.error)}
            onRetry={() => admins.refetch()}
          />
            ) : (admins.data ?? []).length === 0 ? (
              <EmptyState icon={<ShieldPlus className="h-8 w-8" />} title="No admins yet" />
            ) : (
              <ul className="divide-y divide-ink-100">
                {(admins.data ?? []).map((a) => (
                  <li key={a.id} className="flex items-center gap-3 py-3">
                    <span className="icon-tile h-9 w-9 shrink-0">
                      <User className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-900">{a.username}</p>
                      <p className="flex items-center gap-1.5 truncate text-xs text-ink-500">
                        <Mail className="h-3 w-3" />
                        {a.email}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] text-ink-400">#{a.id}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}