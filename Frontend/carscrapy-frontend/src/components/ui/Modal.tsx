import { cn } from '@/lib/cn'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  /** Wide variant for tables and long forms. */
  size?: 'md' | 'lg'
}

/** Stack of currently-open modals, so Escape only closes the top one. */
const modalStack: symbol[] = []

/**
 * Accessible modal.
 *
 * Rendered through a portal to `document.body` so it can never be trapped by
 * an ancestor that has a `transform` / `filter` / `backdrop-filter` (the page
 * wrappers use `animate-fade-up`, which sets a transform and would otherwise
 * become the containing block for `position: fixed`, pushing the dialog
 * off-centre or entirely off-screen on mobile).
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  // Resolve the portal target only in the browser.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const idRef = useRef<symbol>()
  if (!idRef.current) idRef.current = Symbol('modal')

  // Close on Escape (top-most modal only) and lock background scroll while open.
  useEffect(() => {
    if (!open) return
    const id = idRef.current!
    modalStack.push(id)

    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      // Only the top-most open modal reacts, so a stacked dialog closes alone.
      if (modalStack[modalStack.length - 1] !== id) return
      e.stopPropagation()
      onClose()
    }

    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      const at = modalStack.lastIndexOf(id)
      if (at !== -1) modalStack.splice(at, 1)
      // Only restore scrolling once the last modal has closed.
      if (modalStack.length === 0) document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open || !mounted) return null

  return createPortal(
    <div
      className={cn(
        // Center on every screen; on mobile first the dialog may fill the width.
        'fixed inset-0 z-[100] flex justify-center overflow-y-auto',
        'items-center p-4 sm:p-6',
      )}
    >
      <div
        className="fixed inset-0 bg-ink-950/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative my-auto flex max-h-[calc(100dvh-2rem)] w-full flex-col overflow-hidden',
          'rounded-2xl bg-white shadow-2xl animate-fade-up motion-reduce:animate-none',
          size === 'lg' ? 'sm:max-w-3xl' : 'sm:max-w-lg',
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-ink-200/70 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-ink-950">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-ink-500">{description}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

        {footer && (
          <footer className="flex justify-end gap-2 border-t border-ink-200/70 bg-ink-50/60 px-5 py-4">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  )
}
