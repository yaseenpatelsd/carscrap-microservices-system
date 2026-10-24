import { api } from './client'
import type {
  Appointment,
  AppointmentCancelRequest,
  AppointmentDetails,
  AppointmentPostponeRequest,
  AppointmentStatusRequest,
  BookingRequest,
  MessageResponse,
  RemoveAssignedStaffRequest,
  StaffAssignToAppointmentRequest,
  StampResponse,
} from '@/types/api'

/** Booking-service — customer side under /appointment. */
export const bookingApi = {
  book: (body: BookingRequest) => api.post<Appointment>('/appointment/booking', body),

  cancel: (body: AppointmentCancelRequest) =>
    api.post<Appointment>('/appointment/booking/cancel', body),

  postpone: (body: AppointmentPostponeRequest) =>
    api.post<Appointment>('/appointment/postpone', body),

  /** All appointments belonging to the caller. */
  all: () => api.list<Appointment>('/appointment/all'),

  /** One appointment by id. */
  get: (id: number) => api.post<Appointment>('/appointment/get', { id }),

  byStatus: (status: string) => api.postList<Appointment>('/appointment/all/status', { status }),

  byDate: (date: string) => api.postList<Appointment>('/appointment/all/date', { date }),

  /** Enriched booking details (car name, yard, city). */
  details: (id: number) =>
    api.post<AppointmentDetails>('/appointment/get/appointment/details', { id }),
}

/** Booking-service — staff/admin management under /management/booking. */
export const bookingAdminApi = {
  /** ADMIN — appointments across the admin's yard for a date range. */
  byDateForAdmin: (start: string, ends: string) =>
    api.postList<Appointment>('/management/booking/get/appointment/by/date-for-admin', {
      start,
      ends,
    }),

  /** STAFF — appointments assigned to this staff member in a date range. */
  byDateForStaff: (start: string, ends: string) =>
    api.postList<Appointment>('/management/booking/get/appointment/by/date-for-staff', {
      start,
      ends,
    }),

  /** SUPER_ADMIN / ADMIN / STAFF — appointments for one yard in a date range. */
  byYardAndDate: (yardId: number, start: string, ends: string) =>
    api.postList<Appointment>('/management/booking/get/list/appointment', {
      yardId,
      start,
      ends,
    }),

  /** SUPER_ADMIN / ADMIN / STAFF — every appointment for one yard. */
  byYard: (yardId: number) =>
    api.postList<Appointment>('/management/booking/get/appointment', { yardId }),

  /** SUPER_ADMIN / ADMIN / STAFF — set status. */
  changeStatus: (body: AppointmentStatusRequest) =>
    api.patch<StampResponse>('/management/booking/change/appointment/status', body),

  /** ADMIN / STAFF — set status (management variant). */
  changeStatusByManagement: (body: AppointmentStatusRequest) =>
    api.patch<StampResponse>('/management/booking/change/status', body),

  /** ADMIN — assign a staff member to an appointment. */
  assignStaff: (body: StaffAssignToAppointmentRequest) =>
    api.post<StampResponse>('/management/booking/staff/assign', body),

  /** ADMIN — remove the assigned staff member. */
  removeStaff: (body: RemoveAssignedStaffRequest) =>
    api.del<Appointment>('/management/booking/remove/staff', body),

  /** ADMIN / STAFF — cancel with a reason. */
  cancel: (body: AppointmentCancelRequest) =>
    api.post<StampResponse>('/management/booking/cancel', body),

  /** ADMIN / STAFF — move to a new date. */
  postpone: (body: AppointmentPostponeRequest) =>
    api.patch<Appointment>('/management/booking/post-pone/appointment-by-management', body),

  /** ADMIN / STAFF — flag the customer as a no-show. */
  markMissed: (appointmentId: number) =>
    api.patch<StampResponse>('/management/booking/user/missed-appointment', { appointmentId }),
}

export type { MessageResponse }