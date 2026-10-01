import { staffApi } from '@/api/auth'
import { bookingAdminApi } from '@/api/booking'
import { errorMessage } from '@/api/client'
import { Button } from '@/components/ui/Button'
import { Badge, EmptyState, Loading, PageHeader, ErrorState } from '@/components/ui/Feedback'
import { Field } from '@/components/ui/Field'
import { Modal } from '@/components/ui/Modal'
import { BOOKING_STATUSES, bookingTone, label } from '@/types/enums'
import type { Appointment, BookingStatus, StaffMember } from '@/types/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CalendarSearch, Search } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { toastError } from '@/lib/toast'

type Mode = 'admin' | 'staff'

/**
 * Shared appointment management screen.
 *
 * - `admin` (ADMIN): searches by date range, assigns/removes staff,
 *   changes status, postpones, cancels, marks missed.
 * - `staff` (STAFF): searches assigned appointments, changes status,
 *   postpones, cancels, marks missed.
 */
export function ManageAppointmentsPage({ mode }: { mode: Mode }) {
  const qc = useQueryClient()
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [searched, setSearched] = useState<{ start: string; end: string } | null>(null)

  const qKey = ['appointments', mode, searched]

  const results = useQuery({
    queryKey: qKey,
    queryFn: () =>
      mode === 'admin'
        ? bookingAdminApi.byDateForAdmin(searched!.start, searched!.end)
        : bookingAdminApi.byDateForStaff(searched!.start, searched!.end),
    enabled: searched !== null,
  })

  /* Staff list is only needed for the admin assign flow. */
  const staff = useQuery({
    queryKey: ['staff', 'yard-list'],
    queryFn: () => staffApi.listForAdmin(),
    enabled: mode === 'admin',
  })

  function refresh() {
    qc.invalidateQueries({ queryKey: ['appointments', mode] })
  }

  function runSearch() {
    if (!start || !end) return toast.error('Select both a start and end date')
    setSearched({ start, end })
  }

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Operations"
        title="Appointments"
        subtitle={
          mode === 'admin'
            ? 'Search bookings for your yard and manage progress, staffing, and status.'
            : 'Search your assigned bookings and update their progress.'
        }
      />

      <div className="card p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Field label="From" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          <Field label="To" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          <Button onClick={runSearch} className="sm:mb-px">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      <div className="mt-5">
        {searched === null ? (
          <EmptyState
            icon={<CalendarSearch className="h-8 w-8" />}
            title="Pick a date range"
            body="Choose a from and to date, then search to load appointments."
          />
        ) : results.isLoading ? (
          <Loading label="Loading appointments…" />
        ) : results.isError ? (
          <ErrorState
            title="Could not load appointments"
            body={errorMessage(results.error)}
            onRetry={() => results.refetch()}
          />
        ) : (results.data ?? []).length === 0 ? (
          <EmptyState title="No appointments found" body="Nothing matches that date range." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {(results.data ?? []).map((a) => (
              <ManageAppointmentCard
                key={a.id}
                mode={mode}
                appointment={a}
                staffList={staff.data ?? []}
                onChanged={refresh}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ManageAppointmentCard({
  appointment,
  mode,
  staffList,
  onChanged,
}: {
  appointment: Appointment
  mode: Mode
  staffList: StaffMember[]
  onChanged: () => void
}) {
  const status = (appointment.status ?? 'PENDING') as BookingStatus
  const locked = status === 'SUCCESSFUL' || status === 'CANCEL'

  const [newStatus, setNewStatus] = useState<BookingStatus>('CONFIRM')
  const [staffId, setStaffId] = useState('')
  const [postponeDate, setPostponeDate] = useState('')
  const [reason, setReason] = useState('')
  const [cancelOpen, setCancelOpen] = useState(false)
  const [missedOpen, setMissedOpen] = useState(false)

  const changeStatus = useMutation({
    mutationFn: () =>
      bookingAdminApi.changeStatusByManagement({ appointmentId: appointment.id, status: newStatus }),
    onSuccess: () => {
      toast.success('Status updated')
      onChanged()
    },
    onError: (e) => toastError(e),
  })

  const assign = useMutation({
    mutationFn: () => bookingAdminApi.assignStaff({ appointmentId: appointment.id, staffId: Number(staffId) }),
    onSuccess: () => {
      toast.success('Staff assigned')
      setStaffId('')
      onChanged()
    },
    onError: (e) => toastError(e),
  })

  const removeStaff = useMutation({
    mutationFn: () => bookingAdminApi.removeStaff({ appointmentId: appointment.id }),
    onSuccess: () => {
      toast.success('Staff removed from appointment')
      onChanged()
    },
    onError: (e) => toastError(e),
  })

  const postpone = useMutation({
    mutationFn: () => bookingAdminApi.postpone({ appointmentId: appointment.id, date: postponeDate }),
    onSuccess: () => {
      toast.success('Appointment postponed')
      setPostponeDate('')
      onChanged()
    },
    onError: (e) => toastError(e),
  })

  const cancel = useMutation({
    mutationFn: () => bookingAdminApi.cancel({ id: appointment.id, reason }),
    onSuccess: (res) => {
      toast.success(res?.message || 'Appointment cancelled')
      setCancelOpen(false)
      setReason('')
      onChanged()
    },
    onError: (e) => toastError(e),
  })

  const missed = useMutation({
    mutationFn: () => bookingAdminApi.markMissed(appointment.id),
    onSuccess: (res) => {
      toast.success(res?.message || 'Marked as missed')
      setMissedOpen(false)
      onChanged()
    },
    onError: (e) => toastError(e),
  })

  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink-900">Booking #{appointment.id}</p>
          <p className="mt-0.5 text-xs text-ink-500">
            {appointment.dateOfAppointment || 'No date'}
          </p>
        </div>
        <Badge className={bookingTone(status)}>
          {label(status)}
        </Badge>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <dt className="text-ink-400">Customer</dt>
          <dd className="font-medium text-ink-700">{appointment.userName || '—'}</dd>
        </div>
        <div>
          <dt className="text-ink-400">Mobile</dt>
          <dd className="font-medium text-ink-700">{appointment.userMobileNo || '—'}</dd>
        </div>
        <div>
          <dt className="text-ink-400">Car request</dt>
          <dd className="font-medium text-ink-700">#{appointment.carDetailsId}</dd>
        </div>
        <div>
          <dt className="text-ink-400">Staff</dt>
          <dd className="font-medium text-ink-700">
            {appointment.staffUsername || 'Not assigned'}
          </dd>
        </div>
      </dl>

      {locked ? (
        <p className="mt-4 rounded-xl bg-ink-50 px-3 py-2 text-xs font-medium text-ink-500">
          {status === 'CANCEL' ? 'This booking was cancelled.' : 'This booking is complete.'}
        </p>
      ) : (
        <div className="mt-4 space-y-4 border-t border-ink-100 pt-4">
          {/* Status */}
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-[8rem] flex-1">
              <label className="label" htmlFor={`status-${appointment.id}`}>
                Change status
              </label>
              <select
                id={`status-${appointment.id}`}
                className="field py-2 text-[13px]"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as BookingStatus)}
              >
                {BOOKING_STATUSES.filter((s) => s !== 'CANCEL').map((s) => (
                  <option key={s} value={s}>
                    {label(s)}
                  </option>
                ))}
              </select>
            </div>
            <Button size="sm" loading={changeStatus.isPending} onClick={() => changeStatus.mutate()}>
              Update
            </Button>
          </div>

          {/* Staff assign — admin only */}
          {mode === 'admin' && (
            <div className="flex flex-wrap items-end gap-2">
              {appointment.staffUsername ? (
                <Button
                  size="sm"
                  variant="ghost"
                  loading={removeStaff.isPending}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => removeStaff.mutate()}
                >
                  Remove assigned staff
                </Button>
              ) : (
                <>
                  <div className="min-w-[8rem] flex-1">
                    <label className="label" htmlFor={`staff-${appointment.id}`}>
                      Assign staff
                    </label>
                    <select
                      id={`staff-${appointment.id}`}
                      className="field py-2 text-[13px]"
                      value={staffId}
                      onChange={(e) => setStaffId(e.target.value)}
                    >
                      <option value="">Select staff</option>
                      {staffList.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.username}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    loading={assign.isPending}
                    onClick={() => {
                      if (!staffId) return toast.error('Select a staff member first')
                      assign.mutate()
                    }}
                  >
                    Assign
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Postpone */}
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-[8rem] flex-1">
              <label className="label" htmlFor={`postpone-${appointment.id}`}>
                Postpone to
              </label>
              <input
                id={`postpone-${appointment.id}`}
                type="date"
                className="field py-2 text-[13px]"
                value={postponeDate}
                onChange={(e) => setPostponeDate(e.target.value)}
              />
            </div>
            <Button
              size="sm"
              variant="ghost"
              loading={postpone.isPending}
              onClick={() => {
                if (!postponeDate) return toast.error('Pick a new date')
                postpone.mutate()
              }}
            >
              Postpone
            </Button>
          </div>

          {/* Destructive */}
          <div className="flex flex-wrap gap-2 border-t border-ink-100 pt-4">
            <Button
              size="sm"
              variant="ghost"
              className="border-amber-200 text-amber-700 hover:bg-amber-50"
              onClick={() => setMissedOpen(true)}
            >
              Mark missed
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => setCancelOpen(true)}
            >
              Cancel appointment
            </Button>
          </div>
        </div>
      )}

      <Modal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancel appointment"
        description={`Booking #${appointment.id}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setCancelOpen(false)}>
              Keep it
            </Button>
            <Button
              loading={cancel.isPending}
              className="bg-red-600 bg-none hover:bg-red-700"
              onClick={() => {
                if (!reason.trim()) return toast.error('A reason is required')
                cancel.mutate()
              }}
            >
              Confirm cancel
            </Button>
          </>
        }
      >
        <Field
          label="Reason"
          placeholder="Why is this being cancelled?"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Modal>

      <Modal
        open={missedOpen}
        onClose={() => setMissedOpen(false)}
        title="Mark as missed"
        description={`Booking #${appointment.id} — the customer did not attend.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setMissedOpen(false)}>
              Cancel
            </Button>
            <Button loading={missed.isPending} onClick={() => missed.mutate()}>
              Mark missed
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-600">
          This flags the appointment as a no-show. The customer will be notified by email.
        </p>
      </Modal>
    </article>
  )
}