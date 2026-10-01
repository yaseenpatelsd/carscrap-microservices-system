import { staffApi } from '@/api/auth'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/Feedback'
import { Field } from '@/components/ui/Field'
import { useMutation } from '@tanstack/react-query'
import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { toastError } from '@/lib/toast'

/** ADMIN — creates a staff account scoped to the admin's yard.
 *  Mirrors POST /staff/register/by/admin (username, password, email). */
export function AdminAddStaffPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const create = useMutation({
    mutationFn: () => staffApi.registerByAdmin({ username, email, password }),
    onSuccess: (staff) => {
      toast.success('Staff created', { description: `${staff.username} can now sign in.` })
      setUsername('')
      setEmail('')
      setPassword('')
    },
    onError: (e) => toastError(e),
  })

  function submit() {
    if (!username.trim()) return toast.error('Username is required')
    if (!email.trim()) return toast.error('Email is required')
    if (password.length < 8) return toast.error('Password must be at least 8 characters')
    create.mutate()
  }

  return (
    <div className="mx-auto max-w-xl animate-fade-up">
      <PageHeader
        eyebrow="Team"
        title="Add staff"
        subtitle="Create a staff account for your yard. They'll sign in with these credentials."
      />

      <div className="card p-5 sm:p-6">
        <div className="space-y-4">
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
          <Button fullWidth loading={create.isPending} onClick={submit}>
            <UserPlus className="h-4 w-4" />
            Create staff account
          </Button>
        </div>
      </div>
    </div>
  )
}