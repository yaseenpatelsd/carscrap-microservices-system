import { yardApi } from '@/api/yard'
import { Button } from '@/components/ui/Button'
import { Loading, PageHeader } from '@/components/ui/Feedback'
import { Field } from '@/components/ui/Field'
import { Modal } from '@/components/ui/Modal'
import { YARD_STATUSES, label, yardTone } from '@/types/enums'
import type { YardStatus } from '@/types/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Mail, Phone, Power, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { toastError } from '@/lib/toast'

/** ADMIN — edit own yard's contact details and operating status.
 *  Mirrors PATCH /management/yard/change/contact-by-admin and
 *  PATCH /management/yard/change/status-by-admin and
 *  PATCH /management/yard/change/status-by-management (live status). */
export function AdminManageYardPage() {
  const qc = useQueryClient()
  const [contactOpen, setContactOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [contact, setContact] = useState('')
  const [status, setStatus] = useState<YardStatus>('ACTIVE')

  /* The live own-yard status comes from the management endpoint. */
  const live = useQuery({
    queryKey: ['yard', 'live-status'],
    queryFn: () => yardApi.changeStatusByManagement(),
  })

  useEffect(() => {
    if (live.data?.status) setStatus(live.data.status)
  }, [live.data])

  /* Own yard's full record — resolved through the admin's yard listing. */
  const yards = useQuery({
    queryKey: ['yards', 'admin-owned'],
    queryFn: () => yardApi.allForAdmin(),
  })
  const ownYard = yards.data?.find((y) => y.managedBy) ?? yards.data?.[0]

  useEffect(() => {
    if (ownYard) {
      setEmail(ownYard.email ?? '')
      setContact(ownYard.contactNo ?? '')
    }
  }, [ownYard])

  const saveContact = useMutation({
    mutationFn: () => yardApi.changeContactByAdmin(contact, email),
    onSuccess: () => {
      toast.success('Contact details updated')
      setContactOpen(false)
      qc.invalidateQueries({ queryKey: ['yards'] })
    },
    onError: (e) => toastError(e),
  })

  const saveStatus = useMutation({
    mutationFn: () => yardApi.changeStatusByAdmin(status),
    onSuccess: () => {
      toast.success('Yard status updated')
      setStatusOpen(false)
      qc.invalidateQueries({ queryKey: ['yard', 'live-status'] })
      qc.invalidateQueries({ queryKey: ['yards'] })
    },
    onError: (e) => toastError(e),
  })

  const toggle = useMutation({
    mutationFn: () => yardApi.changeStatusByManagement(),
    onSuccess: (res) => {
      toast.success(`Yard is now ${label(res.status ?? '')}`)
      qc.invalidateQueries({ queryKey: ['yard', 'live-status'] })
    },
    onError: (e) => toastError(e),
  })

  const currentStatus = (live.data?.status ?? 'ACTIVE') as YardStatus

  return (
    <div className="mx-auto max-w-3xl animate-fade-up">
      <PageHeader
        eyebrow="Yard"
        title="Manage my yard"
        subtitle="Keep contact information and operating status up to date."
      />

      {live.isLoading && yards.isLoading ? (
        <Loading label="Loading yard…" />
      ) : (
        <>
          {/* Live status banner */}
          <section className="card flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3.5">
              <span className="icon-tile h-10 w-10">
                <Power className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink-900">Operating status</p>
                <span
                  className={`pill mt-1 ${yardTone(currentStatus)}`}
                >
                  {label(currentStatus)}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              loading={toggle.isPending}
              onClick={() => toggle.mutate()}
            >
              <RefreshCw className="h-4 w-4" />
              Toggle open / closed
            </Button>
          </section>

          {/* Contact summary */}
          <section className="card mt-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-ink-900">
                  {ownYard?.name ?? 'Your yard'}
                </p>
                <p className="mt-0.5 text-xs text-ink-500">
                  {ownYard ? `${label(ownYard.city ?? '')}, ${label(ownYard.state ?? '')}` : '—'}
                </p>
              </div>
            </div>

            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-center gap-2 text-ink-600">
                <Phone className="h-4 w-4 text-ink-400" />
                {ownYard?.contactNo || 'No contact number on file'}
              </div>
              <div className="flex items-center gap-2 text-ink-600">
                <Mail className="h-4 w-4 text-ink-400" />
                {ownYard?.email || 'No email on file'}
              </div>
            </dl>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setContactOpen(true)}>
                Edit contact
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setStatusOpen(true)}>
                Change status
              </Button>
            </div>
          </section>
        </>
      )}

      {/* Edit contact modal */}
      <Modal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title="Edit contact details"
        description="These are shown to customers searching for yards."
        footer={
          <>
            <Button variant="ghost" onClick={() => setContactOpen(false)}>
              Cancel
            </Button>
            <Button
              loading={saveContact.isPending}
              onClick={() => {
                if (!/^\d{10}$/.test(contact)) return toast.error('Contact must be 10 digits')
                if (!email.includes('@')) return toast.error('Enter a valid email')
                saveContact.mutate()
              }}
            >
              Save changes
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field
            label="Contact number"
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit number"
            value={contact}
            onChange={(e) => setContact(e.target.value.replace(/\D/g, ''))}
          />
          <Field
            label="Email"
            type="email"
            placeholder="yard@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </Modal>

      {/* Change status modal */}
      <Modal
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        title="Change yard status"
        description="Customers can only book with active yards."
        footer={
          <>
            <Button variant="ghost" onClick={() => setStatusOpen(false)}>
              Cancel
            </Button>
            <Button loading={saveStatus.isPending} onClick={() => saveStatus.mutate()}>
              Update status
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          {YARD_STATUSES.map((s) => (
            <label
              key={s}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${
                status === s ? 'border-brand-500 bg-brand-50/60' : 'border-ink-200 hover:bg-ink-50'
              }`}
            >
              <input
                type="radio"
                name="yard-status"
                className="h-4 w-4 accent-brand-600"
                checked={status === s}
                onChange={() => setStatus(s)}
              />
              <span className="text-sm font-medium text-ink-800">{label(s)}</span>
            </label>
          ))}
        </div>
      </Modal>
    </div>
  )
}