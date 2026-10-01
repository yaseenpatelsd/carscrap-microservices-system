import { authApi } from '@/api/auth'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { useAuth } from '@/lib/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { AtSign, KeyRound, User, UserRoundPlus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { AuthLayout } from './AuthLayout'
import { toastError } from '@/lib/toast'

/** Constraints mirror RegisterDto.java exactly. */
const schema = z.object({
  username: z
    .string()
    .min(4, 'At least 4 characters')
    .max(15, 'At most 15 characters'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .max(60, 'At most 60 characters'),
})

type FormValues = z.infer<typeof schema>

export function RegisterPage() {
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
      await authApi.register(values)
      toast.success('Account created', {
        description: 'We emailed you a 6-digit verification code.',
      })
      // Carry the username forward so the verify step can prefill it.
      navigate('/verify', { state: { username: values.username } })
    } catch (error) {
      toastError(error)
    }
  }

  async function handleGuest() {
    setGuestLoading(true)
    try {
      const { token } = await authApi.guestLogin()
      signIn(token)
      toast.success('Continuing as guest')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      toastError(error)
    } finally {
      setGuestLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start getting instant scrap valuations in under a minute."
      footer={
        <>
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Field
          label="Username"
          placeholder="Choose a username"
          autoComplete="username"
          icon={<User className="h-4 w-4" />}
          hint="4–15 characters"
          error={errors.username?.message}
          {...register('username')}
        />

        <Field
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          icon={<AtSign className="h-4 w-4" />}
          hint="We'll send a verification code here."
          error={errors.email?.message}
          {...register('email')}
        />

        <Field
          label="Password"
          type="password"
          placeholder="Create a password"
          autoComplete="new-password"
          icon={<KeyRound className="h-4 w-4" />}
          hint="8–60 characters"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" fullWidth loading={isSubmitting}>
          {!isSubmitting && <UserRoundPlus className="h-4 w-4" />}
          Create account
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
    </AuthLayout>
  )
}