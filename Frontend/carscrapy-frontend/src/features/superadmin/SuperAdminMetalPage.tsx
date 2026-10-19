import { carApi } from '@/api/car'
import { Button } from '@/components/ui/Button'
import { Loading, PageHeader } from '@/components/ui/Feedback'
import { Coins } from 'lucide-react'
import { Field } from '@/components/ui/Field'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { toastError } from '@/lib/toast'

const METALS = [
  { key: 'steel', label: 'Steel' },
  { key: 'aluminum', label: 'Aluminium' },
  { key: 'copper', label: 'Copper' },
  { key: 'iron', label: 'Iron' },
  { key: 'plastic', label: 'Plastic' },
  { key: 'rubber', label: 'Rubber' },
  { key: 'electronics', label: 'Electronics' },
  { key: 'lead', label: 'Lead' },
] as const

type MetalKey = (typeof METALS)[number]['key']

/** SUPER_ADMIN — view and update scrap metal rates.
 *  Mirrors PATCH /metal/change-metal-price and GET /metal/get-metal-price. */
export function SuperAdminMetalPage() {
  const qc = useQueryClient()
  const [values, setValues] = useState<Partial<Record<MetalKey, string>>>({})

  const current = useQuery({
    queryKey: ['metal', 'price'],
    queryFn: () => carApi.getMetalPrice(),
  })

  // Prefill the inputs with the current rates once loaded.
  useEffect(() => {
    if (current.data) {
      setValues(
        Object.fromEntries(
          METALS.map((m) => [m.key, current.data?.[m.key] != null ? String(current.data[m.key]) : '']),
        ) as Partial<Record<MetalKey, string>>,
      )
    }
  }, [current.data])

  const save = useMutation({
    mutationFn: () => {
      const payload: Partial<Record<MetalKey, number>> = {}
      for (const m of METALS) {
        const raw = values[m.key]
        if (raw !== undefined && raw !== '') {
          const n = Number(raw)
          if (!Number.isNaN(n)) payload[m.key] = n
        }
      }
      return carApi.changeMetalPrice(payload)
    },
    onSuccess: () => {
      toast.success('Metal prices updated')
      qc.invalidateQueries({ queryKey: ['metal', 'price'] })
    },
    onError: (e) => toastError(e),
  })

  return (
    <div className="mx-auto max-w-3xl animate-fade-up">
      <PageHeader
        eyebrow="Pricing"
        title="Metal prices"
        subtitle="These rates drive every scrap valuation. Leave a field unchanged to keep its current value."
      />

      {current.isLoading ? (
        <Loading label="Loading current rates…" />
      ) : (
        <div className="card p-5 sm:p-6">
          {current.isError && (
            <p className="mb-4 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Could not load current rates — you can still enter new values.
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {METALS.map((m) => (
              <Field
                key={m.key}
                label={m.label}
                type="number"
                step="0.01"
                placeholder="—"
                value={values[m.key] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [m.key]: e.target.value }))}
              />
            ))}
          </div>

          <Button
            className="mt-6"
            fullWidth
            loading={save.isPending}
            onClick={() => {
              const changed = Object.values(values).some((v) => v !== '' && v !== undefined)
              if (!changed) return toast.error('Enter at least one value')
              save.mutate()
            }}
          >
            <Coins className="h-4 w-4" />
            Update prices
          </Button>
        </div>
      )}
    </div>
  )
}