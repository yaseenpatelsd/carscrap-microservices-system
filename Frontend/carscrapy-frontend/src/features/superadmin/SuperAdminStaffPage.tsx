import { staffApi } from '@/api/auth'
import { errorMessage } from '@/api/client'
import { yardApi } from '@/api/yard'
import { Button } from '@/components/ui/Button'
import { EmptyState, Loading, PageHeader, ErrorState } from '@/components/ui/Feedback'
import { Field } from '@/components/ui/Field'
import { label } from '@/types/enums'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Mail, UserPlus, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { toastError } from '@/lib/toast'

/** SUPER_ADMIN — register staff and view all staff.
 *  Mirrors POST /staff/register (requires yardId) and GET /staff/getAll. */
export function SuperAdminStaffPage() {
  const qc = useQueryClient()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [yardId, setYardId] = useState('')

  const staff = useQuery({
    queryKey: ['staff', 'all'],
    queryFn: () => staffApi.getAll(),
  })

  const yards = useQuery({
    queryKey: ['yards', 'all-admin'],
    queryFn: () => yardApi.allForAdmin(),
  })

  useEffect(() => {
    if (!yardId && yards.data?.length) setYardId(String(yards.data[0].yardId))
  }, [yards.data, yardId])

  const create = useMutation({
    mutationFn: () =>
      staffApi.register({ username, email, password, yardId: Number(yardId) }),
    onSuccess: (res) => {
      toast.success('Staff created', { description: `${res.username} is assigned to the yard.` })
      setUsername('')
      setEmail('')
      setPassword('')
      qc.invalidateQueries({ queryKey: ['staff', 'all'] })
    },
    onError: (e) => toastError(e),
  })

  function submit() {
    if (!username.trim()) return toast.error('Username is required')
    if (!email.trim()) return toast.error('Email is required')
    if (password.length < 8) return toast.error('Password must be at least 8 characters')
    if (!yardId) return toast.error('Select a yard')
    create.mutate()
  }

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Access"
        title="Staff"
        subtitle="Register staff members and see who works where."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <section className="card p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-ink-900">Register staff</h2>
          <p className="mt-1 text-sm text-ink-500">
            Staff are assigned to a yard at creation. Admins can reassign later.
          </p>

          <div className="mt-5 space-y-4">
            <Field label="Username" placeholder="staff_username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Field
              label="Email"
              type="email"
              placeholder="staff@example.com"
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
            <div>
              <label className="label" htmlFor="yard">
                Assign to yard
              </label>
              <select id="yard" className="field" value={yardId} onChange={(e) => setYardId(e.target.value)}>
                <option value="">Select a yard</option>
                {(yards.data ?? []).map((y) => (
                  <option key={y.yardId} value={y.yardId}>
                    {y.name} — {label(y.city ?? '')}
                  </option>
                ))}
              </select>
            </div>
            <Button fullWidth loading={create.isPending} onClick={submit}>
              <UserPlus className="h-4 w-4" />
              Create staff
            </Button>
          </div>
        </section>

        <section className="card p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-ink-900">All staff</h2>
          <p className="mt-1 text-sm text-ink-500">{staff.data?.length ?? 0} staff members.</p>

          <div className="mt-4">
            {staff.isLoading ? (
              <Loading label="Loading staff…" />
            ) : staff.isError ? (
              <ErrorState
            title="Could not load staff"
            body={errorMessage(staff.error)}
            onRetry={() => staff.refetch()}
          />
            ) : (staff.data ?? []).length === 0 ? (
              <EmptyState icon={<Users className="h-8 w-8" />} title="No staff yet" />
            ) : (
              <ul className="divide-y divide-ink-100">
                {(staff.data ?? []).map((s) => (
                  <li key={s.id} className="flex items-center gap-3 py-3">
                    <span className="icon-tile h-9 w-9 shrink-0 font-semibold">
                      {s.username.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-900">{s.username}</p>
                      <p className="flex items-center gap-1.5 truncate text-xs text-ink-500">
                        <Mail className="h-3 w-3" />
                        {s.email}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] text-ink-400">#{s.id}</span>
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