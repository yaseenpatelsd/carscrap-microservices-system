import { yardApi } from '@/api/yard'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/Feedback'
import { Field } from '@/components/ui/Field'
import { INDIAN_CITIES, INDIAN_STATES, YARD_STATUSES, label } from '@/types/enums'
import type { YardStatus } from '@/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Store } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { toastError } from '@/lib/toast'

/** SUPER_ADMIN — create a yard. Mirrors POST /yard/add. */
export function SuperAdminAddYardPage() {
  const qc = useQueryClient()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [city, setCity] = useState<string>(INDIAN_CITIES[0])
  const [state, setState] = useState<string>(INDIAN_STATES[0])
  const [pincode, setPincode] = useState('')
  const [contactNo, setContactNo] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<YardStatus>('ACTIVE')

  const create = useMutation({
    mutationFn: () =>
      yardApi.add({
        name,
        city,
        state,
        country: 'INDIA',
        pincode,
        contactNo,
        email,
        status,
      }),
    onSuccess: (yard) => {
      toast.success('Yard created', { description: `${yard.name} is now listed.` })
      qc.invalidateQueries({ queryKey: ['yards'] })
      navigate('/super-admin/yards')
    },
    onError: (e) => toastError(e),
  })

  function submit() {
    if (!name.trim()) return toast.error('Yard name is required')
    if (!/^\d{6}$/.test(pincode)) return toast.error('Pincode must be 6 digits')
    if (!/^\d{10}$/.test(contactNo)) return toast.error('Contact must be 10 digits')
    if (!email.includes('@')) return toast.error('Enter a valid email')
    create.mutate()
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      <PageHeader
        eyebrow="Network"
        title="Add a scrap yard"
        subtitle="Register a new recycler. You can assign an admin and staff afterwards."
      />

      <div className="card p-5 sm:p-6">
        <div className="space-y-4">
          <Field label="Yard name" placeholder="e.g. GreenMetal Recyclers" value={name} onChange={(e) => setName(e.target.value)} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="city">
                City
              </label>
              <select id="city" className="field" value={city} onChange={(e) => setCity(e.target.value)}>
                {INDIAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {label(c)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="state">
                State
              </label>
              <select id="state" className="field" value={state} onChange={(e) => setState(e.target.value)}>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {label(s)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Pincode"
              inputMode="numeric"
              maxLength={6}
              placeholder="400001"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            />
            <Field
              label="Contact number"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit number"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value.replace(/\D/g, ''))}
            />
          </div>

          <Field
            label="Email"
            type="email"
            placeholder="yard@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div>
            <label className="label" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className="field"
              value={status}
              onChange={(e) => setStatus(e.target.value as YardStatus)}
            >
              {YARD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {label(s)}
                </option>
              ))}
            </select>
          </div>

          <Button fullWidth loading={create.isPending} onClick={submit}>
            <Store className="h-4 w-4" />
            Create yard
          </Button>
        </div>
      </div>
    </div>
  )
}