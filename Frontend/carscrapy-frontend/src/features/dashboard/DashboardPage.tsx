import { carApi } from '@/api/car'
import { bookingApi } from '@/api/booking'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/Feedback'
import { Field } from '@/components/ui/Field'
import { Modal } from '@/components/ui/Modal'
import { StatCard } from '@/components/ui/StatCard'
import { useAuth } from '@/lib/auth'
import { CAR_CITIES, FUEL_TYPES, VEHICLE_TYPES, label } from '@/types/enums'
import type { CarPriceResponse } from '@/types/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowRight,
  BadgeIndianRupee,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  Sparkles,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { toastError } from '@/lib/toast'

/** Customer overview — mirrors the reference dashboard.js stat strip + actions. */
export function DashboardPage() {
  const { user, isGuest } = useAuth()
  const qc = useQueryClient()
  const [priceOpen, setPriceOpen] = useState(false)

  const requests = useQuery({
    queryKey: ['car', 'requests'],
    queryFn: () => carApi.allRequests(),
  })

  const appointments = useQuery({
    queryKey: ['appointments', 'all'],
    queryFn: () => bookingApi.all(),
  })

  const estimate = useMutation({
    mutationFn: carApi.getPrice,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['car', 'requests'] })
      toast.success(`Estimated Rs ${Number(data.estimatePrice ?? 0).toLocaleString()}`, {
        description: data.eligible ? 'This vehicle is eligible for scrapping.' : 'Not currently eligible.',
      })
    },
    onError: (e) => toastError(e),
  })

  const requestCount = requests.data?.length ?? 0
  const appointmentCount = appointments.data?.length ?? 0
  const totalValue = (requests.data ?? []).reduce((sum, r) => sum + Number(r.estimatePrice ?? 0), 0)

  const ACTIONS = [
    {
      title: 'Get a price estimate',
      body: 'Tell us about your vehicle and get an instant scrap valuation.',
      icon: BadgeIndianRupee,
      onClick: () => setPriceOpen(true),
    },
    {
      title: 'Find a scrap yard',
      body: 'Search certified recyclers by city, state, or pincode.',
      icon: Search,
      to: '/dashboard/yards',
    },
    {
      title: 'Book an appointment',
      body: 'Schedule an inspection and pickup at your chosen yard.',
      icon: CalendarCheck,
      to: '/dashboard/book',
    },
    {
      title: 'My requests',
      body: 'Review submitted cars and their price estimates.',
      icon: TrendingUp,
      to: '/dashboard/requests',
    },
    {
      title: 'My appointments',
      body: 'Track status, postpone, or cancel bookings.',
      icon: Calendar,
      to: '/dashboard/appointments',
    },
  ]

  return (
    <div className="mx-auto max-w-5xl animate-fade-up">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-ink-gradient p-6 shadow-card sm:p-8">
        <div aria-hidden className="absolute -right-16 -top-20 h-72 w-72 animate-blob rounded-full bg-brand-500/25 blur-3xl" />
        <div aria-hidden className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative">
          <p className="eyebrow text-brand-300">
            {isGuest ? 'Guest workspace' : 'Customer workspace'}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Hello, {isGuest ? 'Guest' : user?.username} 👋
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-300">
            Estimate your vehicle&apos;s scrap value, compare nearby yards, and book an inspection —
            all from here.
          </p>
          <Button className="mt-6" onClick={() => setPriceOpen(true)}>
            Get your scrap value
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Stats — live, not placeholders */}
      <section className="mt-5 grid gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard label="Price requests" value={requestCount} icon={TrendingUp} />
        <StatCard label="Appointments" value={appointmentCount} icon={Clock} tone="sky" />
        <StatCard
          label="Total estimated value"
          value={`₹${totalValue.toLocaleString()}`}
          icon={BadgeIndianRupee}
          tone="amber"
        />
      </section>

      {isGuest && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-900">You&apos;re browsing as a guest</p>
            <p className="mt-1 text-sm text-amber-700">
              A temporary profile was created so you can try everything. Register a real account when
              you want to keep your requests and appointments.{' '}
              <Link to="/register" className="font-semibold underline underline-offset-2">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      )}

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-ink-400">
        Quick actions
      </h2>
      <section className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACTIONS.map(({ title, body, icon: Icon, to, onClick }) => {
          const inner = (
            <>
              <span className="icon-tile h-11 w-11 transition group-hover:bg-brand-gradient group-hover:text-white group-hover:ring-transparent">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-ink-900">
                {title}
                <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-brand-500 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{body}</p>
            </>
          )
          return to ? (
            <Link key={title} to={to} className="card card-hover group block p-5">
              {inner}
            </Link>
          ) : (
            <button key={title} onClick={onClick} className="card card-hover group block p-5 text-left">
              {inner}
            </button>
          )
        })}
      </section>

      {/* Recent requests preview */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-400">
            Recent requests
          </h2>
          {requestCount > 0 && (
            <Link to="/dashboard/requests" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all
            </Link>
          )}
        </div>
        <div className="mt-3">
          {requests.isLoading ? (
            <div className="card p-5 text-sm text-ink-400">Loading…</div>
          ) : requestCount === 0 ? (
            <EmptyState
              icon={<BadgeIndianRupee className="h-8 w-8" />}
              title="No price requests yet"
              body="Get your first estimate and it will show up here."
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {(requests.data ?? []).slice(0, 4).map((r) => (
                <RequestCard key={r.id} request={r} />
              ))}
            </div>
          )}
        </div>
      </section>

      <GetPriceModal
        open={priceOpen}
        onClose={() => setPriceOpen(false)}
        submitting={estimate.isPending}
        onSubmit={(values) => estimate.mutate(values)}
      />
    </div>
  )
}

function RequestCard({ request }: { request: CarPriceResponse }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink-900">{request.name}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-500">
            <MapPin className="h-3 w-3" />
            {label(request.city)} · {request.registrationYear}
          </p>
        </div>
        <p className="shrink-0 text-sm font-bold text-ink-950">
          ₹{Number(request.estimatePrice ?? 0).toLocaleString()}
        </p>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs">
        {request.eligible ? (
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" /> Eligible
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 font-semibold text-red-600">
            <XCircle className="h-3.5 w-3.5" /> Not eligible
          </span>
        )}
        <span className="text-ink-400">·</span>
        <span className="text-ink-500">
          {label(request.vehicleType)} · {label(request.fuelType)}
        </span>
      </div>
    </div>
  )
}

/** Modal that posts /car/get-price. Shared shape with the reference form. */
export function GetPriceModal({
  open,
  onClose,
  onSubmit,
  submitting,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (values: {
    name: string
    registrationYear: number
    vehicleType: (typeof VEHICLE_TYPES)[number]
    fuelType: (typeof FUEL_TYPES)[number]
    city: (typeof CAR_CITIES)[number]
  }) => void
  submitting: boolean
}) {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')
  const [vehicleType, setVehicleType] = useState<(typeof VEHICLE_TYPES)[number]>(VEHICLE_TYPES[0])
  const [fuelType, setFuelType] = useState<(typeof FUEL_TYPES)[number]>(FUEL_TYPES[0])
  const [city, setCity] = useState<(typeof CAR_CITIES)[number]>(CAR_CITIES[0])

  function submit() {
    if (!name.trim()) return toast.error('Vehicle name is required')
    const registrationYear = Number(year)
    if (!registrationYear || registrationYear < 1950 || registrationYear > 2030) {
      return toast.error('Enter a year between 1950 and 2030')
    }
    onSubmit({ name: name.trim(), registrationYear, vehicleType, fuelType, city })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Get scrap price"
      description="Enter your vehicle details to calculate an estimated scrap value."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} loading={submitting}>
            Get price
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field
          label="Vehicle name"
          placeholder="e.g. Maruti Swift"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Field
          label="Registration year"
          type="number"
          placeholder="2015"
          min={1950}
          max={2030}
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="vehicleType">
              Vehicle type
            </label>
            <select
              id="vehicleType"
              className="field"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value as (typeof VEHICLE_TYPES)[number])}
            >
              {VEHICLE_TYPES.map((v) => (
                <option key={v} value={v}>
                  {label(v)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="fuelType">
              Fuel type
            </label>
            <select
              id="fuelType"
              className="field"
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value as (typeof FUEL_TYPES)[number])}
            >
              {FUEL_TYPES.map((f) => (
                <option key={f} value={f}>
                  {label(f)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="city">
            City
          </label>
          <select
            id="city"
            className="field"
            value={city}
            onChange={(e) => setCity(e.target.value as (typeof CAR_CITIES)[number])}
          >
            {CAR_CITIES.map((c) => (
              <option key={c} value={c}>
                {label(c)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  )
}