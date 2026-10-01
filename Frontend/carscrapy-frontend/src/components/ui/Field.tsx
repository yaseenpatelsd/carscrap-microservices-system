import { cn } from '@/lib/cn'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useState } from 'react'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: ReactNode
  icon?: ReactNode
  /** Renders the input without its own label (parent supplies one). */
  hideLabel?: boolean
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, hint, icon, hideLabel = false, className, id, type, ...props },
  ref,
) {
  const inputId = id || props.name
  const isPassword = type === 'password'
  const [revealed, setRevealed] = useState(false)

  return (
    <div>
      {!hideLabel && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <div className="group relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 transition group-focus-within:text-brand-500">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={isPassword && revealed ? 'text' : type}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            'field',
            icon ? 'pl-11' : undefined,
            isPassword ? 'pr-11' : undefined,
            error ? 'field-error' : undefined,
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            className="absolute right-2.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-ink-400 transition hover:bg-ink-100 hover:text-ink-600 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1"
          >
            {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600 animate-fade-in"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
      {!error && hint && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>}
    </div>
  )
})