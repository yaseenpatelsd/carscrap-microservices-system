import { authApi } from '@/api/auth'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { AuthLayout } from './AuthLayout'
import { toastError } from '@/lib/toast'

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
})

type FormValues = z.infer<typeof schema>

/**
 * Step 1 of password reset: request an OTP for the username.
 * The backend rate-limits this to one request per 60 seconds.
 */
export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    try {
      await authApi.requestPasswordResetOtp(values)
      toast.success('Reset code sent', { description: 'Check your email inbox.' })
      navigate('/reset-password', { state: { username: values.username } })
    } catch (error) {
      toastError(error)
    }
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your username and we'll email you a reset code."
      footer={
        <>
          Remembered it?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Back to sign in
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
          hint="You can request a new code once per minute."
          error={errors.username?.message}
          {...register('username')}
        />

        <Button type="submit" fullWidth loading={isSubmitting}>
          Send reset code
        </Button>
      </form>
    </AuthLayout>
  )
}