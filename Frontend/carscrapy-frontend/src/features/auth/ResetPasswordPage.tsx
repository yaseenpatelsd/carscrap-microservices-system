import { authApi } from '@/api/auth'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRound, ShieldCheck, User } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { AuthLayout } from './AuthLayout'
import { toastError } from '@/lib/toast'

/**
 * Step 2 of password reset. PasswordReset.java requires:
 * username, a 6-char otp, and the new password.
 */
const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  otp: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
  password: z.string().min(8, 'At least 8 characters').max(60, 'At most 60 characters'),
})

type FormValues = z.infer<typeof schema>

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const prefilledUsername = (location.state as { username?: string } | null)?.username ?? ''

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: prefilledUsername, otp: '', password: '' },
  })

  async function onSubmit(values: FormValues) {
    try {
      await authApi.resetPassword(values)
      toast.success('Password changed', { description: 'Sign in with your new password.' })
      navigate('/login', { replace: true })
    } catch (error) {
      toastError(error)
    }
  }

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Enter the code we emailed you and choose a new password."
      footer={
        <>
          Didn&apos;t get a code?{' '}
          <Link to="/forgot-password" className="font-semibold text-brand-600 hover:text-brand-700">
            Request another
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Field
          label="Username"
          placeholder="Your username"
          autoComplete="username"
          icon={<User className="h-4 w-4" />}
          error={errors.username?.message}
          {...register('username')}
        />

        <Field
          label="Reset code"
          placeholder="123456"
          inputMode="numeric"
          maxLength={6}
          autoComplete="one-time-code"
          icon={<ShieldCheck className="h-4 w-4" />}
          error={errors.otp?.message}
          {...register('otp')}
        />

        <Field
          label="New password"
          type="password"
          placeholder="Choose a new password"
          autoComplete="new-password"
          icon={<KeyRound className="h-4 w-4" />}
          hint="8–60 characters"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" fullWidth loading={isSubmitting}>
          Change password
        </Button>
      </form>
    </AuthLayout>
  )
}