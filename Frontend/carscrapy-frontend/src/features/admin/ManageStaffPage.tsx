import { staffApi } from '@/api/auth'
import { errorMessage } from '@/api/client'
import { yardApi } from '@/api/yard'
import { Button } from '@/components/ui/Button'
import { EmptyState, Loading, PageHeader, ErrorState } from '@/components/ui/Feedback'
import { Modal } from '@/components/ui/Modal'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Mail, Trash2, User } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { toastError } from '@/lib/toast'

/** ADMIN — lists staff in the admin's yard and allows removal.
 *  Mirrors POST /staff/staff/List and DELETE /management/yard/staff/remove. */
export function AdminManageStaffPage() {
  const qc = useQueryClient()
  const [removeTarget, setRemoveTarget] = useState<{ id: number; username: string } | null>(null)

  const staff = useQuery({
    queryKey: ['staff', 'admin-list'],
    queryFn: () => staffApi.listForAdmin(),
  })

  const remove = useMutation({
    mutationFn: (staffId: number) => yardApi.removeStaffByAdmin(staffId),
    onSuccess: (res) => {
      toast.success(res?.message || 'Staff removed')
      setRemoveTarget(null)
      qc.invalidateQueries({ queryKey: ['staff', 'admin-list'] })
    },
    onError: (e) => toastError(e),
  })

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Team"
        title="Manage staff"
        subtitle="Everyone assigned to your yard. Removing revokes their assignment."
      />

      {staff.isLoading ? (
        <Loading label="Loading staff…" />
      ) : staff.isError ? (
        <ErrorState
            title="Could not load staff"
            body={errorMessage(staff.error)}
            onRetry={() => staff.refetch()}
          />
      ) : (staff.data ?? []).length === 0 ? (
        <EmptyState
          icon={<User className="h-8 w-8" />}
          title="No staff yet"
          body="Add a staff member to get started."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(staff.data ?? []).map((s) => (
            <article key={s.id} className="card p-5">
              <div className="flex items-start gap-3">
                <span className="icon-tile h-10 w-10 shrink-0 font-semibold">
                  {s.username.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900">{s.username}</p>
                  <p className="flex items-center gap-1.5 truncate text-xs text-ink-500">
                    <Mail className="h-3 w-3" />
                    {s.email}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-ink-400">Staff ID #{s.id}</p>
              <Button
                size="sm"
                variant="ghost"
                className="mt-3 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => setRemoveTarget({ id: s.id, username: s.username })}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </Button>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={removeTarget !== null}
        onClose={() => setRemoveTarget(null)}
        title="Remove staff member"
        description={`Remove ${removeTarget?.username} from your yard?`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setRemoveTarget(null)}>
              Cancel
            </Button>
            <Button
              loading={remove.isPending}
              className="bg-red-600 bg-none hover:bg-red-700"
              onClick={() => remove.mutate(removeTarget!.id)}
            >
              Remove
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-600">
          This unassigns them from your yard. Their account still exists and can be reassigned later.
        </p>
      </Modal>
    </div>
  )
}