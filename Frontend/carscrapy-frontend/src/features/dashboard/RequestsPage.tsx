import { carApi } from '@/api/car'
import { errorMessage } from '@/api/client'
import { Button } from '@/components/ui/Button'
import { EmptyState, Loading, PageHeader, ErrorState } from '@/components/ui/Feedback'
import { label } from '@/types/enums'
import type { CarPriceResponse } from '@/types/api'
import { useQuery } from '@tanstack/react-query'
import { BadgeIndianRupee, CalendarCheck, CheckCircle2, MapPin, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

/** Customer price-request history — mirrors the reference "My Requests" modal. */
export function RequestsPage() {
  const navigate = useNavigate()
  const requests = useQuery({
    queryKey: ['car', 'requests'],
    queryFn: () => carApi.allRequests(),
  })

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="History"
        title="My requests"
        subtitle="Every vehicle you've valued, with its estimate and eligibility."
        actions={
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            New estimate
          </Button>
        }
      />

      {requests.isLoading ? (
        <Loading label="Loading requests…" />
      ) : requests.isError ? (
        <ErrorState
            title="Could not load requests"
            body={errorMessage(requests.error)}
            onRetry={() => requests.refetch()}
          />
      ) : (requests.data ?? []).length === 0 ? (
        <EmptyState
          icon={<BadgeIndianRupee className="h-8 w-8" />}
          title="No requests yet"
          body="Get a price estimate from the overview page and it will appear here."
          action={<Button onClick={() => navigate('/dashboard')}>Get a price</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {(requests.data ?? []).map((r) => (
            <RequestDetailCard
              key={r.id}
              request={r}
              onBook={() => navigate('/dashboard/book', { state: { carDetailId: r.id } })}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function RequestDetailCard({
  request,
  onBook,
}: {
  request: CarPriceResponse
  onBook?: () => void
}) {
  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-ink-900">{request.name}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-500">
            <MapPin className="h-3 w-3" />
            {label(request.city ?? '')} · Registered {request.registrationYear}
          </p>
        </div>
        <p className="shrink-0 text-base font-bold text-ink-950">
          ₹{Number(request.estimatePrice ?? 0).toLocaleString()}
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
        <div>
          <dt className="text-ink-400">Vehicle</dt>
          <dd className="font-medium text-ink-700">{label(request.vehicleType ?? '')}</dd>
        </div>
        <div>
          <dt className="text-ink-400">Fuel</dt>
          <dd className="font-medium text-ink-700">{label(request.fuelType ?? '')}</dd>
        </div>
        <div>
          <dt className="text-ink-400">Expiry</dt>
          <dd className="font-medium text-ink-700">{request.dateOfExpire ?? '—'}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between gap-3">
        {request.eligible ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> Eligible for scrapping
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600">
            <XCircle className="h-4 w-4" /> Not eligible
          </span>
        )}

        {onBook && request.eligible && (
          <Button size="sm" onClick={onBook}>
            <CalendarCheck className="h-4 w-4" />
            Book
          </Button>
        )}
      </div>
    </article>
  )
}