import { bookingApi } from '@/api/booking'
import { errorMessage } from '@/api/client'
import { Button } from '@/components/ui/Button'
import { Badge, EmptyState, Loading, PageHeader, ErrorState } from '@/components/ui/Feedback'
import { Field } from '@/components/ui/Field'
import { Modal } from '@/components/ui/Modal'
import { bookingTone, label } from '@/types/enums'
import type { Appointment, BookingStatus } from '@/types/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Calendar, CalendarX, Clock } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { toastError } from '@/lib/toast'

/** Customer appointment list with cancel / postpone / details. */
export function AppointmentsPage() {
  const qc = useQueryClient()
  const [detailId, setDetailId] = useState<number | null>(null)
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null)
  const [postponeTarget, setPostponeTarget] = useState<Appointment | null>(null)

  const appointments = useQuery({
    queryKey: ['appointments', 'all'],
    queryFn: () => bookingApi.all(),
  })

  const details = useQuery({
    queryKey: ['appointments', 'details', detailId],
    queryFn: () => bookingApi.details(detailId!),
    enabled: detailId !== null,
  })

  function refresh() {
    qc.invalidateQueries({ queryKey: ['appointments'] })
  }

  const data = appointments.data ?? []

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Scheduling"
        title="My appointments"
        subtitle="Track every booking and manage changes."
        actions={
          <Link to="/dashboard/book">
            <Button variant="ghost">Book new</Button>
          </Link>
        }
      />

      {appointments.isLoading ? (
        <Loading label="Loading appointments…" />
      ) : appointments.isError ? (
        <ErrorState
            title="Could not load appointments"
            body={errorMessage(appointments.error)}
            onRetry={() => appointments.refetch()}
          />
      ) : data.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-8 w-8" />}
          title="No appointments yet"
          body="Once you book an inspection it will show up here."
          action={
            <Link to="/dashboard/book">
              <Button>Book an appointment</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((a) => (
            <AppointmentCard
              key={a.id}
              appointment={a}
              onView={() => setDetailId(a.id)}
              onCancel={() => setCancelTarget(a)}
              onPostpone={() => setPostponeTarget(a)}
            />
          ))}
        </div>
      )}

      {/* Details */}
      <Modal
        open={detailId !== null}
        onClose={() => setDetailId(null)}
        title="Appointment details"
        description={`Booking #${detailId}`}
      >
        {details.isLoading ? (
          <Loading label="Loading details…" />
        ) : details.isError ? (
          <p className="text-sm text-red-600">{errorMessage(details.error)}</p>
        ) : details.data ? (
          <dl className="space-y-3 text-sm">
            {[
              ['Car', details.data.carname],
              ['Expiry year', details.data.expireYear],
              ['Yard', details.data.yardName],
              ['City', details.data.city ? label(details.data.city) : '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-4 border-b border-ink-100 pb-2.5 last:border-0">
                <dt className="text-ink-500">{k}</dt>
                <dd className="font-medium text-ink-900">{v || '—'}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Modal>

      <CancelDialog
        target={cancelTarget}
        onClose={() => setCancelTarget(null)}
        onDone={() => {
          setCancelTarget(null)
          refresh()
        }}
      />

      <PostponeDialog
        target={postponeTarget}
        onClose={() => setPostponeTarget(null)}
        onDone={() => {
          setPostponeTarget(null)
          refresh()
        }}
      />
    </div>
  )
}

export function AppointmentCard({
  appointment,
  onView,
  onCancel,
  onPostpone,
  compact,
}: {
  appointment: Appointment
  onView?: () => void
  onCancel?: () => void
  onPostpone?: () => void
  compact?: boolean
}) {
  const status = (appointment.status ?? 'PENDING') as BookingStatus
  const locked = status === 'SUCCESSFUL' || status === 'CANCEL'

  return (
    <article className="card flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink-900">Booking #{appointment.id}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-500">
            <Clock className="h-3.5 w-3.5" />
            {appointment.dateOfAppointment || 'Date unavailable'}
          </p>
        </div>
        <Badge className={bookingTone(status)}>
          {label(status)}
        </Badge>
      </div>

      {!compact && (
        <dl className="mt-4 space-y-2 text-xs">
          <div className="flex justify-between gap-3">
            <dt className="text-ink-400">Car request</dt>
            <dd className="font-medium text-ink-700">#{appointment.carDetailsId}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ink-400">Staff</dt>
            <dd className="font-medium text-ink-700">
              {appointment.staffUsername || 'Not assigned'}
            </dd>
          </div>
          {appointment.userMobileNo && (
            <div className="flex justify-between gap-3">
              <dt className="text-ink-400">Mobile</dt>
              <dd className="font-medium text-ink-700">{appointment.userMobileNo}</dd>
            </div>
          )}
        </dl>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {onView && (
          <Button size="sm" variant="ghost" onClick={onView}>
            View details
          </Button>
        )}
        {!locked && onPostpone && (
          <Button size="sm" variant="ghost" onClick={onPostpone}>
            Postpone
          </Button>
        )}
        {!locked && onCancel && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancel}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            Cancel
          </Button>
        )}
        {locked && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-400">
            <CalendarX className="h-3.5 w-3.5" />
            {status === 'CANCEL' ? 'Cancelled' : 'Completed'}
          </span>
        )}
      </div>
    </article>
  )
}

function CancelDialog({
  target,
  onClose,
  onDone,
}: {
  target: Appointment | null
  onClose: () => void
  onDone: () => void
}) {
  const [reason, setReason] = useState('')

  const cancel = useMutation({
    mutationFn: () => bookingApi.cancel({ id: target!.id, reason }),
    onSuccess: () => {
      toast.success('Appointment cancelled')
      setReason('')
      onDone()
    },
    onError: (e) => toastError(e),
  })

  return (
    <Modal
      open={target !== null}
      onClose={onClose}
      title="Cancel appointment"
      description={`Booking #${target?.id}. This cannot be undone.`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Keep it
          </Button>
          <Button
            loading={cancel.isPending}
            onClick={() => {
              if (!reason.trim()) return toast.error('A reason is required')
              cancel.mutate()
            }}
            className="bg-red-600 bg-none hover:bg-red-700"
          >
            Confirm cancel
          </Button>
        </>
      }
    >
      <Field
        label="Reason"
        placeholder="Why are you cancelling?"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
    </Modal>
  )
}

function PostponeDialog({
  target,
  onClose,
  onDone,
}: {
  target: Appointment | null
  onClose: () => void
  onDone: () => void
}) {
  const [date, setDate] = useState('')

  const postpone = useMutation({
    mutationFn: () => bookingApi.postpone({ appointmentId: target!.id, date }),
    onSuccess: () => {
      toast.success('Appointment postponed')
      setDate('')
      onDone()
    },
    onError: (e) => toastError(e),
  })

  return (
    <Modal
      open={target !== null}
      onClose={onClose}
      title="Postpone appointment"
      description={`Booking #${target?.id} — pick a new date.`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            loading={postpone.isPending}
            onClick={() => {
              if (!date) return toast.error('Please choose a date')
              postpone.mutate()
            }}
          >
            Confirm postpone
          </Button>
        </>
      }
    >
      <Field label="New date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
    </Modal>
  )
}