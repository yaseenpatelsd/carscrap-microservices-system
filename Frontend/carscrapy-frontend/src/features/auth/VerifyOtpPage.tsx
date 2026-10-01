import { authApi } from '@/api/auth'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShieldCheck, User } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { AuthLayout } from './AuthLayout'
import { toastError } from '@/lib/toast'

/** AccountVerificationDto requires username + a 6-char otp. */
const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  otp: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
})

type FormValues = z.infer<typeof schema>

export function VerifyOtpPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const prefilledUsername = (location.state as { username?: string } | null)?.username ?? ''

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: prefilledUsername, otp: '' },
  })

  async function onSubmit(values: FormValues) {
    try {
      await authApi.verifyAccount(values)
      toast.success('Account verified', { description: 'You can sign in now.' })
      navigate('/login', { replace: true })
    } catch (error) {
      toastError(error)
    }
  }

  return (
    <AuthLayout
      title="Verify your account"
      subtitle="Enter the 6-digit code we emailed you to activate your account."
      footer={
        <>
          Wrong email?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
            Register again
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Field
          label="Username"
          placeholder="Your username"
          icon={<User className="h-4 w-4" />}
          error={errors.username?.message}
          {...register('username')}
        />

        <Field
          label="Verification code"
          placeholder="123456"
          inputMode="numeric"
          maxLength={6}
          autoComplete="one-time-code"
          icon={<ShieldCheck className="h-4 w-4" />}
          hint="Codes expire 10 minutes after they're sent."
          error={errors.otp?.message}
          {...register('otp')}
        />

        <Button type="submit" fullWidth loading={isSubmitting}>
          Verify account
        </Button>
      </form>
    </AuthLayout>
  )
}