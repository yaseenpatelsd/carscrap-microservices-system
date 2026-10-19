import { api } from './client'
import type {
  StampResponse,
  Yard,
  YardContactChangeRequest,
  YardCreateRequest,
  YardEditRequest,
  YardSearchRequest,
  YardStatus,
  YardStatusChangeRequest,
} from '@/types/api'

/** Parse a "Contact"/"ContactNo" style query string from a search body. */
function compact<T extends object>(body: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(body).filter(([, v]) => v !== '' && v !== undefined && v !== null),
  ) as Partial<T>
}

/** Yard-service — public search plus SUPER_ADMIN / ADMIN management. */
export const yardApi = {
  /* ------------------------------- public ------------------------------ */

  findAll: () => api.list<Yard>('/search/all'),

  findById: (id: number) => api.get<Yard>(`/search/${id}`),

  search: (body: YardSearchRequest) => api.postList<Yard>('/search', compact(body)),

  /* --------------------------- SUPER_ADMIN ----------------------------- */

  add: (body: YardCreateRequest) => api.post<Yard>('/yard/add', body),

  edit: (body: YardEditRequest) => api.patch<Yard>('/yard/edit', compact(body)),

  allForAdmin: () => api.list<Yard>('/yard/get/all'),

  /** SUPER_ADMIN filtered search (same body shape as public search). */
  adminSearch: (body: YardSearchRequest) => api.postList<Yard>('/yard/search', compact(body)),

  byStatus: (status: YardStatus) => api.postList<Yard>('/yard/all-By-status', { status }),

  assignAdmin: (yardId: number, adminId: number) =>
    api.post<StampResponse>('/yard/assign/admin', { yardId, adminId }),

  removeAdmin: (yardId: number) =>
    api.post<Yard>('/yard/remove/admin', { yardId }),

  /* ------------------------ management /yard --------------------------- */

  changeStatus: (body: YardStatusChangeRequest) =>
    api.patch<Yard>('/management/yard/change/status', body),

  editContact: (body: YardContactChangeRequest) =>
    api.patch<Yard>('/management/yard/edit/contact', body),

  /** SUPER_ADMIN — assign a staff member to a yard. */
  addStaff: (yardId: number, staffId: number) =>
    api.post<StampResponse>('/management/yard/add/staff', { yardId, staffId }),

  /** SUPER_ADMIN — remove a staff member from a yard. */
  removeStaff: (yardId: number, staffId: number) =>
    api.post<StampResponse>('/management/yard/remove/staff', { yardId, staffId }),

  /* --------------------- management /yard (admin) ---------------------- */

  /** ADMIN — update own yard's contact details. */
  changeContactByAdmin: (contact: string, email: string) =>
    api.patch<Yard>('/management/yard/change/contact-by-admin', { contact, email }),

  /** ADMIN — set own yard's status. */
  changeStatusByAdmin: (status: YardStatus) =>
    api.patch<Yard>('/management/yard/change/status-by-admin', { status }),

  /** STAFF + ADMIN — flip own yard open/closed. */
  changeStatusByManagement: () =>
    api.patch<{ status: YardStatus }>('/management/yard/change/status-by-management'),

  /** ADMIN — assign a staff member to own yard. */
  addStaffByAdmin: (yardId: number, staffId: number) =>
    api.post<void>('/management/yard/staff/add', { yardId, staffId }),

  /** ADMIN — remove a staff member from own yard. */
  removeStaffByAdmin: (staffId: number) =>
    api.del<StampResponse>('/management/yard/staff/remove', { staffId }),

  /** SUPER_ADMIN — staff ids assigned to a yard. */
  staffIdsForYard: (yardId: number) =>
    api.postList<{ id: number[] }>('/management/yard/staff/details', { yardId }),
}