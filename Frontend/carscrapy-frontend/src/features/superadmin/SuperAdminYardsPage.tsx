import { adminApi, staffApi } from '@/api/auth'
import { errorMessage } from '@/api/client'
import { yardApi } from '@/api/yard'
import { Button } from '@/components/ui/Button'
import { EmptyState, Loading, PageHeader, ErrorState } from '@/components/ui/Feedback'
import { Field } from '@/components/ui/Field'
import { Modal } from '@/components/ui/Modal'
import { INDIAN_CITIES, INDIAN_STATES, YARD_STATUSES, label, yardTone } from '@/types/enums'
import type { StaffMember, Yard, YardStatus } from '@/types/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Mail,
  MapPin,
  Pencil,
  Phone,
  Search,
  ShieldOff,
  ShieldPlus,
  Store,
  UserMinus,
  UserPlus,
  Users,
  Power,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { toastError } from '@/lib/toast'

type DialogKind =
  | { kind: 'edit'; yard: Yard }
  | { kind: 'assignAdmin'; yard: Yard }
  | { kind: 'removeAdmin'; yard: Yard }
  | { kind: 'assignStaff'; yard: Yard }
  | { kind: 'viewStaff'; yard: Yard }
  | { kind: 'status'; yard: Yard }
  | { kind: 'contact'; yard: Yard }
  | null

/** SUPER_ADMIN — full yard management.
 *  Mirrors /yard/* and /management/yard/* super-admin calls in the reference. */
export function SuperAdminYardsPage() {
  const qc = useQueryClient()
  const [dialog, setDialog] = useState<DialogKind>(null)
  const [filters, setFilters] = useState({ name: '', city: '', state: '', pincode: '' })

  const hasFilters = Object.values(filters).some((v) => v !== '')

  const yards = useQuery({
    queryKey: ['yards', 'all-admin', filters],
    queryFn: () => (hasFilters ? yardApi.adminSearch(filters) : yardApi.allForAdmin()),
    placeholderData: (prev) => prev,
  })

  function refresh() {
    qc.invalidateQueries({ queryKey: ['yards'] })
    setDialog(null)
  }

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Network"
        title="Scrap yards"
        subtitle="Edit yards, assign admins and staff, and control availability."
      />

      {/* Filters */}
      <div className="card p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field
            label="Name"
            placeholder="Any"
            value={filters.name}
            onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
          />
          <div>
            <label className="label" htmlFor="f-city">
              City
            </label>
            <select
              id="f-city"
              className="field"
              value={filters.city}
              onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
            >
              <option value="">Any city</option>
              {INDIAN_CITIES.map((c) => (
                <option key={c} value={c}>
                  {label(c)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="f-state">
              State
            </label>
            <select
              id="f-state"
              className="field"
              value={filters.state}
              onChange={(e) => setFilters((f) => ({ ...f, state: e.target.value }))}
            >
              <option value="">Any state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {label(s)}
                </option>
              ))}
            </select>
          </div>
          <Field
            label="Pincode"
            placeholder="Any"
            value={filters.pincode}
            onChange={(e) => setFilters((f) => ({ ...f, pincode: e.target.value }))}
          />
        </div>
      </div>

      <div className="mt-5">
        {yards.isLoading ? (
          <Loading label="Loading yards…" />
        ) : yards.isError ? (
          <ErrorState
            title="Could not load yards"
            body={errorMessage(yards.error)}
            onRetry={() => yards.refetch()}
          />
        ) : (yards.data ?? []).length === 0 ? (
          <EmptyState
            icon={<Search className="h-8 w-8" />}
            title="No yards found"
            body="Try clearing the filters or add a new yard."
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {(yards.data ?? []).map((yard) => (
              <YardAdminCard key={yard.yardId} yard={yard} onAction={setDialog} />
            ))}
          </div>
        )}
      </div>

      <YardDialogs dialog={dialog} onClose={() => setDialog(null)} onDone={refresh} />
    </div>
  )
}

function YardAdminCard({
  yard,
  onAction,
}: {
  yard: Yard
  onAction: (d: DialogKind) => void
}) {
  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="icon-tile h-10 w-10 shrink-0">
            <Store className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-ink-900">{yard.name}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-500">
              <MapPin className="h-3 w-3" />
              {label(yard.city ?? '')}, {label(yard.state ?? '')} — {yard.pincode}
            </p>
          </div>
        </div>
        <span
          className={`pill shrink-0 ${yardTone(yard.status)}`}
        >
          {label(yard.status ?? '')}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-500">
        {yard.contactNo && (
          <span className="flex items-center gap-1.5">
            <Phone className="h-3 w-3" />
            {yard.contactNo}
          </span>
        )}
        {yard.email && (
          <span className="flex items-center gap-1.5">
            <Mail className="h-3 w-3" />
            {yard.email}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <ShieldPlus className="h-3 w-3" />
          {yard.managedBy ? `Admin: ${yard.managedBy}` : 'No admin assigned'}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-ink-100 pt-4">
        <Button size="sm" variant="ghost" onClick={() => onAction({ kind: 'edit', yard })}>
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onAction({ kind: 'assignAdmin', yard })}>
          <ShieldPlus className="h-3.5 w-3.5" />
          Assign admin
        </Button>
        {yard.managedBy && (
          <Button size="sm" variant="ghost" onClick={() => onAction({ kind: 'removeAdmin', yard })}>
            <ShieldOff className="h-3.5 w-3.5" />
            Remove admin
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={() => onAction({ kind: 'assignStaff', yard })}>
          <UserPlus className="h-3.5 w-3.5" />
          Assign staff
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onAction({ kind: 'viewStaff', yard })}>
          <Users className="h-3.5 w-3.5" />
          View staff
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onAction({ kind: 'contact', yard })}>
          <Phone className="h-3.5 w-3.5" />
          Contact
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onAction({ kind: 'status', yard })}>
          <Power className="h-3.5 w-3.5" />
          Status
        </Button>
      </div>
    </article>
  )
}

function YardDialogs({
  dialog,
  onClose,
  onDone,
}: {
  dialog: DialogKind
  onClose: () => void
  onDone: () => void
}) {
  if (!dialog) return null

  switch (dialog.kind) {
    case 'edit':
      return <EditYardDialog yard={dialog.yard} onClose={onClose} onDone={onDone} />
    case 'assignAdmin':
      return <AssignAdminDialog yard={dialog.yard} onClose={onClose} onDone={onDone} />
    case 'removeAdmin':
      return <RemoveAdminDialog yard={dialog.yard} onClose={onClose} onDone={onDone} />
    case 'assignStaff':
      return <AssignStaffDialog yard={dialog.yard} onClose={onClose} onDone={onDone} />
    case 'viewStaff':
      return <ViewStaffDialog yard={dialog.yard} onClose={onClose} onDone={onDone} />
    case 'contact':
      return <ContactDialog yard={dialog.yard} onClose={onClose} onDone={onDone} />
    case 'status':
      return <StatusDialog yard={dialog.yard} onClose={onClose} onDone={onDone} />
  }
}

/* ------------------------------- dialogs ------------------------------ */

function EditYardDialog({ yard, onClose, onDone }: { yard: Yard; onClose: () => void; onDone: () => void }) {
  const [name, setName] = useState(yard.name ?? '')
  const [contactNo, setContactNo] = useState(yard.contactNo ?? '')
  const [email, setEmail] = useState(yard.email ?? '')
  const [status, setStatus] = useState<string>(yard.status ?? '')

  const save = useMutation({
    mutationFn: () => {
      const payload: Record<string, unknown> = { yardId: yard.yardId }
      if (name) payload.name = name
      if (contactNo) payload.contactNo = contactNo
      if (email) payload.email = email
      if (status) payload.status = status
      return yardApi.edit(payload as never)
    },
    onSuccess: () => {
      toast.success('Yard updated')
      onDone()
    },
    onError: (e) => toastError(e),
  })

  return (
    <Modal
      open
      onClose={onClose}
      title="Edit yard"
      description={yard.name}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            loading={save.isPending}
            onClick={() => {
              if (contactNo && !/^\d{10}$/.test(contactNo))
                return toast.error('Contact must be 10 digits')
              save.mutate()
            }}
          >
            Save changes
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Field
          label="Contact number"
          inputMode="numeric"
          maxLength={10}
          value={contactNo}
          onChange={(e) => setContactNo(e.target.value.replace(/\D/g, ''))}
        />
        <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div>
          <label className="label" htmlFor="edit-status">
            Status
          </label>
          <select id="edit-status" className="field" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Unchanged</option>
            {YARD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {label(s)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  )
}

function AssignAdminDialog({ yard, onClose, onDone }: { yard: Yard; onClose: () => void; onDone: () => void }) {
  const [adminId, setAdminId] = useState('')

  const admins = useQuery({ queryKey: ['admin', 'all'], queryFn: () => adminApi.getAll() })

  const assign = useMutation({
    mutationFn: () => yardApi.assignAdmin(yard.yardId, Number(adminId)),
    onSuccess: (res) => {
      toast.success(res?.message || 'Admin assigned')
      onDone()
    },
    onError: (e) => toastError(e),
  })

  return (
    <Modal
      open
      onClose={onClose}
      title="Assign admin"
      description={`${yard.name} — assign an admin to manage this yard.`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            loading={assign.isPending}
            onClick={() => {
              if (!adminId) return toast.error('Select an admin')
              assign.mutate()
            }}
          >
            Assign
          </Button>
        </>
      }
    >
      {admins.isLoading ? (
        <Loading label="Loading admins…" />
      ) : (
        <div>
          <label className="label" htmlFor="assign-admin">
            Admin
          </label>
          <select
            id="assign-admin"
            className="field"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
          >
            <option value="">Select an admin</option>
            {(admins.data ?? []).map((a) => (
              <option key={a.id} value={a.id}>
                {a.username} ({a.email})
              </option>
            ))}
          </select>
        </div>
      )}
    </Modal>
  )
}

function RemoveAdminDialog({ yard, onClose, onDone }: { yard: Yard; onClose: () => void; onDone: () => void }) {
  const remove = useMutation({
    mutationFn: () => yardApi.removeAdmin(yard.yardId),
    onSuccess: () => {
      toast.success('Admin removed from yard')
      onDone()
    },
    onError: (e) => toastError(e),
  })

  return (
    <Modal
      open
      onClose={onClose}
      title="Remove admin"
      description={yard.name}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            loading={remove.isPending}
            className="bg-red-600 bg-none hover:bg-red-700"
            onClick={() => remove.mutate()}
          >
            Remove admin
          </Button>
        </>
      }
    >
      <p className="text-sm text-ink-600">
        This unassigns <strong>{yard.managedBy ?? 'the current admin'}</strong> from{' '}
        <strong>{yard.name}</strong>. The yard will have no admin until you assign another.
      </p>
    </Modal>
  )
}

function AssignStaffDialog({ yard, onClose, onDone }: { yard: Yard; onClose: () => void; onDone: () => void }) {
  const [staffId, setStaffId] = useState('')

  const staff = useQuery({ queryKey: ['staff', 'all'], queryFn: () => staffApi.getAll() })

  const assign = useMutation({
    mutationFn: () => yardApi.addStaff(yard.yardId, Number(staffId)),
    onSuccess: (res) => {
      toast.success(res?.message || 'Staff assigned')
      onDone()
    },
    onError: (e) => toastError(e),
  })

  return (
    <Modal
      open
      onClose={onClose}
      title="Assign staff"
      description={`${yard.name} — pick a staff member to add.`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            loading={assign.isPending}
            onClick={() => {
              if (!staffId) return toast.error('Select a staff member')
              assign.mutate()
            }}
          >
            Assign
          </Button>
        </>
      }
    >
      {staff.isLoading ? (
        <Loading label="Loading staff…" />
      ) : (
        <div>
          <label className="label" htmlFor="assign-staff">
            Staff member
          </label>
          <select id="assign-staff" className="field" value={staffId} onChange={(e) => setStaffId(e.target.value)}>
            <option value="">Select staff</option>
            {(staff.data ?? []).map((s: StaffMember) => (
              <option key={s.id} value={s.id}>
                {s.username} ({s.email})
              </option>
            ))}
          </select>
        </div>
      )}
    </Modal>
  )
}

function ViewStaffDialog({ yard, onClose, onDone }: { yard: Yard; onClose: () => void; onDone: () => void }) {
  const staff = useQuery({
    queryKey: ['staff', 'yard', yard.yardId],
    queryFn: () => staffApi.inYard(yard.yardId),
  })

  const remove = useMutation({
    mutationFn: (staffId: number) => yardApi.removeStaff(yard.yardId, staffId),
    onSuccess: (res) => {
      toast.success(res?.message || 'Staff removed')
      staff.refetch()
      onDone()
    },
    onError: (e) => toastError(e),
  })

  return (
    <Modal open onClose={onClose} title="Yard staff" description={yard.name}>
      {staff.isLoading ? (
        <Loading label="Loading staff…" />
      ) : (staff.data ?? []).length === 0 ? (
        <EmptyState icon={<Users className="h-8 w-8" />} title="No staff assigned" />
      ) : (
        <ul className="divide-y divide-ink-100">
          {(staff.data ?? []).map((s) => (
            <li key={s.id} className="flex items-center gap-3 py-3">
              <span className="icon-tile h-9 w-9 shrink-0 font-semibold">
                {s.username.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink-900">{s.username}</p>
                <p className="truncate text-xs text-ink-500">{s.email}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="shrink-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                loading={remove.isPending}
                onClick={() => remove.mutate(s.id)}
              >
                <UserMinus className="h-3.5 w-3.5" />
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}

function ContactDialog({ yard, onClose, onDone }: { yard: Yard; onClose: () => void; onDone: () => void }) {
  const [email, setEmail] = useState(yard.email ?? '')
  const [contact, setContact] = useState(yard.contactNo ?? '')

  const save = useMutation({
    mutationFn: () => yardApi.editContact({ yardId: yard.yardId, Contact: contact, email }),
    onSuccess: () => {
      toast.success('Contact updated')
      onDone()
    },
    onError: (e) => toastError(e),
  })

  return (
    <Modal
      open
      onClose={onClose}
      title="Edit contact"
      description={yard.name}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            loading={save.isPending}
            onClick={() => {
              if (!/^\d{10}$/.test(contact)) return toast.error('Contact must be 10 digits')
              if (!email.includes('@')) return toast.error('Enter a valid email')
              save.mutate()
            }}
          >
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field
          label="Contact number"
          inputMode="numeric"
          maxLength={10}
          value={contact}
          onChange={(e) => setContact(e.target.value.replace(/\D/g, ''))}
        />
        <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
    </Modal>
  )
}

function StatusDialog({ yard, onClose, onDone }: { yard: Yard; onClose: () => void; onDone: () => void }) {
  const [status, setStatus] = useState<YardStatus>((yard.status as YardStatus) ?? 'ACTIVE')

  const save = useMutation({
    mutationFn: () => yardApi.changeStatus({ yardId: yard.yardId, status }),
    onSuccess: () => {
      toast.success('Status updated')
      onDone()
    },
    onError: (e) => toastError(e),
  })

  return (
    <Modal
      open
      onClose={onClose}
      title="Change status"
      description={yard.name}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={save.isPending} onClick={() => save.mutate()}>
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
              name="yard-status-super"
              className="h-4 w-4 accent-brand-600"
              checked={status === s}
              onChange={() => setStatus(s)}
            />
            <span className="text-sm font-medium text-ink-800">{label(s)}</span>
          </label>
        ))}
      </div>
    </Modal>
  )
}