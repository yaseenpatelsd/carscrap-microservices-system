import { bookingApi } from '@/api/booking'
import { carApi } from '@/api/car'
import { yardApi } from '@/api/yard'
import { Button } from '@/components/ui/Button'
import { EmptyState, Loading, PageHeader } from '@/components/ui/Feedback'
import { Field } from '@/components/ui/Field'
import { label } from '@/types/enums'
import type { Yard } from '@/types/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CalendarCheck, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { toastError } from '@/lib/toast'

/** Customer booking — mirrors the reference appointment modal. */
export function BookPage() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()
  const preselected = (location.state as { yardId?: number; carDetailId?: number } | null) ?? {}

  const [carDetailId, setCarDetailId] = useState<string>(preselected.carDetailId?.toString() ?? '')
  const [yardId, setYardId] = useState<string>(preselected.yardId?.toString() ?? '')
  const [date, setDate] = useState('')
  const [mobile, setMobile] = useState('')

  const requests = useQuery({
    queryKey: ['car', 'requests'],
    queryFn: () => carApi.allRequests(),
  })

  const yards = useQuery({
    queryKey: ['yards', 'all'],
    queryFn: () => yardApi.findAll(),
  })

  // Prefill the first available option once data arrives, if nothing is chosen.
  useEffect(() => {
    if (!carDetailId && requests.data?.length) setCarDetailId(String(requests.data[0].id))
  }, [requests.data, carDetailId])

  useEffect(() => {
    if (!yardId && yards.data?.length) setYardId(String(yards.data[0].yardId))
  }, [yards.data, yardId])

  const book = useMutation({
    mutationFn: bookingApi.book,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['appointments', 'all'] })
      toast.success('Appointment booked', { description: 'Track it under My appointments.' })
      navigate('/dashboard/appointments')
    },
    onError: (e) => toastError(e),
  })

  function submit() {
    if (!carDetailId) return toast.error('Select a price request')
    if (!yardId) return toast.error('Select a scrap yard')
    if (!date) return toast.error('Choose a date')
    if (!/^\d{10}$/.test(mobile)) return toast.error('Mobile number must be 10 digits')

    book.mutate({
      carDetailId: Number(carDetailId),
      yardId: Number(yardId),
      dateOfAppointment: date,
      mobileNo: mobile,
    })
  }

  const loading = requests.isLoading || yards.isLoading
  const noRequests = !requests.isLoading && (requests.data ?? []).length === 0
  const noYards = !yards.isLoading && (yards.data ?? []).length === 0

  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      <PageHeader
        eyebrow="Scheduling"
        title="Book an appointment"
        subtitle="Pick a price request, choose a yard, and confirm your inspection slot."
      />

      {loading ? (
        <Loading label="Preparing booking…" />
      ) : noRequests ? (
        <EmptyState
          icon={<CalendarCheck className="h-8 w-8" />}
          title="You need a price request first"
          body="Bookings are tied to a vehicle valuation. Get an estimate, then come back here."
          action={
            <Link to="/dashboard">
              <Button>Get a price</Button>
            </Link>
          }
        />
      ) : noYards ? (
        <EmptyState
          icon={<MapPin className="h-8 w-8" />}
          title="No yards available"
          body="There are no active scrap yards to book with right now."
        />
      ) : (
        <div className="card p-5 sm:p-6">
          <div className="space-y-5">
            <div>
              <label className="label" htmlFor="request">
                Vehicle request
              </label>
              <select
                id="request"
                className="field"
                value={carDetailId}
                onChange={(e) => setCarDetailId(e.target.value)}
              >
                {(requests.data ?? []).map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — ₹{Number(r.estimatePrice ?? 0).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="yard">
                Scrap yard
              </label>
              <select
                id="yard"
                className="field"
                value={yardId}
                onChange={(e) => setYardId(e.target.value)}
              >
                {(yards.data ?? []).map((y: Yard) => (
                  <option key={y.yardId} value={y.yardId}>
                    {y.name} — {label(y.city ?? '')}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-ink-500">
                Need a different yard?{' '}
                <Link to="/dashboard/yards" className="font-semibold text-brand-600 hover:text-brand-700">
                  Browse all yards
                </Link>
              </p>
            </div>

            <Field
              label="Appointment date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <Field
              label="Mobile number"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
              hint="We'll use this to reach you about the inspection."
            />

            <Button fullWidth loading={book.isPending} onClick={submit}>
              <CalendarCheck className="h-4 w-4" />
              Confirm booking
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}