import { errorMessage, errorReference } from '@/api/client'
import { toast } from 'sonner'

/**
 * Single place that turns a thrown API error into a user-facing toast.
 *
 * Adds a short support reference when the failure is unexpected (5xx or a
 * network problem), so a user can quote it and you can find the request in
 * the logs. Validation-style 4xx errors just show their message.
 */
export function toastError(error: unknown, title = 'Something went wrong') {
  const message = errorMessage(error)
  const ref = errorReference(error)

  toast.error(title, {
    description: ref ? `${message} (ref ${ref})` : message,
  })
}