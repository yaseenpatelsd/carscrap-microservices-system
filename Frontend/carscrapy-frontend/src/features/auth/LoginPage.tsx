import { authApi } from '@/api/auth'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { useAuth, homeForRole } from '@/lib/auth'
import { decodeToken } from '@/lib/token'
import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRound, LogIn, User, UserRoundPlus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { AuthLayout } from './AuthLayout'
import { toastError } from '@/lib/toast'

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [guestLoading, setGuestLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    try {
      const { token } = await authApi.login(values)
      signIn(token)
      toast.success('Welcome back')
      // decodeToken reads the freshly stored token, so routing is role-correct.
      const role = decodeToken(token)?.role
      navigate(homeForRole(role), { replace: true })
    } catch (error) {
      toastError(error)
    }
  }

  /** Creates a throwaway GUEST account server-side and signs in with its JWT. */
  async function handleGuest() {
    setGuestLoading(true)
    try {
      const { token } = await authApi.guestLogin()
      signIn(token)
      toast.success('Continuing as guest', {
        description: 'Guest sessions are temporary — explore freely.',
      })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      toastError(error)
    } finally {
      setGuestLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your scrap requests and appointments."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Field
          label="Username"
          placeholder="Enter your username"
          autoComplete="username"
          icon={<User className="h-4 w-4" />}
          error={errors.username?.message}
          {...register('username')}
        />

        <div>
          <div className="flex items-baseline justify-between">
            <span className="label">Password</span>
            <Link
              to="/forgot-password"
              className="mb-1.5 text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              Forgot password?
            </Link>
          </div>
          <Field
            label="Password"
            id="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            icon={<KeyRound className="h-4 w-4" />}
            error={errors.password?.message}
            hideLabel
            {...register('password')}
          />
        </div>

        <Button type="submit" fullWidth loading={isSubmitting}>
          {!isSubmitting && <LogIn className="h-4 w-4" />}
          Sign in
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-ink-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-ink-50 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">
            or
          </span>
        </div>
      </div>

      <Button variant="ghost" fullWidth loading={guestLoading} onClick={handleGuest} type="button">
        {!guestLoading && <UserRoundPlus className="h-4 w-4" />}
        Continue as guest
      </Button>
      <p className="mt-3 text-center text-xs text-ink-400">
        No account needed. A temporary profile is created for you.
      </p>
    </AuthLayout>
  )
}