import { errorMessage } from '@/api/client'
import { yardApi } from '@/api/yard'
import { Button } from '@/components/ui/Button'
import { EmptyState, Loading, PageHeader, ErrorState } from '@/components/ui/Feedback'
import { Field } from '@/components/ui/Field'
import { INDIAN_CITIES, INDIAN_STATES, label, yardTone } from '@/types/enums'
import type { Yard } from '@/types/api'
import { useQuery } from '@tanstack/react-query'
import { MapPin, Phone, Search as SearchIcon, Mail, CalendarCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/** Customer yard discovery — mirrors the reference yard search modal. */
export function YardsPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')

  const filters = { name, city, state, pincode }
  const hasFilters = Object.values(filters).some((v) => v !== '')

  const yards = useQuery({
    queryKey: ['yards', 'search', filters],
    queryFn: () => (hasFilters ? yardApi.search(filters) : yardApi.findAll()),
    placeholderData: (prev) => prev,
  })

  function reset() {
    setName('')
    setCity('')
    setState('')
    setPincode('')
  }

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Discovery"
        title="Scrap yards"
        subtitle="Search certified recyclers and pick one for your appointment."
        actions={
          hasFilters && (
            <Button variant="ghost" onClick={reset}>
              Clear filters
            </Button>
          )
        }
      />

      <div className="card p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Yard name" placeholder="Any" value={name} onChange={(e) => setName(e.target.value)} />
          <div>
            <label className="label" htmlFor="city">
              City
            </label>
            <select id="city" className="field" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Any city</option>
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
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-5">
        {yards.isLoading ? (
          <Loading label="Finding yards…" />
        ) : yards.isError ? (
          <ErrorState
            title="Could not load yards"
            body={errorMessage(yards.error)}
            onRetry={() => yards.refetch()}
          />
        ) : (yards.data ?? []).length === 0 ? (
          <EmptyState
            icon={<SearchIcon className="h-8 w-8" />}
            title="No yards found"
            body="Try widening your search — remove a filter or pick a different city."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(yards.data ?? []).map((yard) => (
              <YardCard
                key={yard.yardId}
                yard={yard}
                onBook={() => navigate('/dashboard/book', { state: { yardId: yard.yardId } })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function YardCard({ yard, onBook }: { yard: Yard; onBook?: () => void }) {
  return (
    <article className="card card-hover flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-ink-900">{yard.name}</h3>
        <span
          className={`pill shrink-0 ${yardTone(yard.status)}`}
        >
          {label(yard.status ?? '')}
        </span>
      </div>

      <p className="mt-2 flex items-start gap-1.5 text-sm text-ink-500">
        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {label(yard.city ?? '')}, {label(yard.state ?? '')} — {yard.pincode}
      </p>

      <div className="mt-3 space-y-1.5 text-xs text-ink-500">
        {yard.contactNo && (
          <p className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            {yard.contactNo}
          </p>
        )}
        {yard.email && (
          <p className="flex items-center gap-1.5 truncate">
            <Mail className="h-3.5 w-3.5" />
            {yard.email}
          </p>
        )}
      </div>

      {onBook && (
        <Button className="mt-4" size="sm" onClick={onBook}>
          <CalendarCheck className="h-4 w-4" />
          Book here
        </Button>
      )}
    </article>
  )
}