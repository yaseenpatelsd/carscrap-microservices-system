import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Catches render-time crashes anywhere in the tree so a single bad
 * component never leaves the user on a blank white page in production.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Wire this to your monitoring (Sentry, Datadog, etc.) in production.
    console.error('[CarScrapy] Unhandled UI error:', error, info.componentStack)
  }

  private reset = () => {
    this.setState({ error: null })
    window.location.assign('/dashboard')
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="grid min-h-screen place-items-center bg-ink-50 px-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-inset ring-red-100">
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
              <path
                d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="mt-5 text-xl font-bold tracking-tight text-ink-950">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            The page hit an unexpected error. Your data is safe — try reloading, and if it keeps
            happening, contact support.
          </p>

          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload page
            </button>
            <button onClick={this.reset} className="btn-ghost">
              Back to dashboard
            </button>
          </div>

          {import.meta.env.DEV && (
            <pre className="mt-6 max-h-48 overflow-auto rounded-xl border border-ink-200 bg-white p-3 text-left text-[11px] leading-relaxed text-red-600">
              {error.message}
            </pre>
          )}
        </div>
      </div>
    )
  }
}