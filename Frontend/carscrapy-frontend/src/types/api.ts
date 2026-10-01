import type {
  BookingStatus,
  CarCity,
  FuelType,
  Role,
  VehicleType,
  YardStatus,
} from './enums'

export type { Role, BookingStatus, YardStatus, VehicleType, FuelType, CarCity }

/* ------------------------------------------------------------------ *
 * Shared
 * ------------------------------------------------------------------ */

/** Every service returns this shape on error (global exception handler). */
export interface ApiError {
  localDateTime?: string
  status?: number
  error?: string
  message?: string
  path?: string
}

/** Simple message + timestamp response used by many auth endpoints. */
export interface MessageResponse {
  message: string
  timestamp: string
}

/** message + stamp shape used by yard/booking management endpoints. */
export interface StampResponse {
  message: string
  stamp: string
}

/** JWT payload produced by JwtGenerator.java */
export interface JwtPayload {
  sub: string // user id as string
  username: string
  role: Role
  iat: number
  exp: number
}

/* ------------------------------------------------------------------ *
 * Auth service — /auth
 * ------------------------------------------------------------------ */

export interface RegisterRequest {
  username: string
  password: string
  email: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface VerifyAccountRequest {
  username: string
  otp: string
}

export interface OtpRequestPayload {
  username: string
}

export interface PasswordResetRequest {
  username: string
  otp: string
  password: string
}

/* ------------------------------------------------------------------ *
 * Auth service — /admin  (SUPER_ADMIN)
 * ------------------------------------------------------------------ */

export interface AdminRegisterRequest {
  username: string
  password: string
  email: string
}

export interface AdminFlowResponse {
  id: number
  username: string
  password: string
  email: string
  note: string | null
}

export interface AdminListItem {
  id: number
  username: string
  email: string
}

/* ------------------------------------------------------------------ *
 * Auth service — /staff  (SUPER_ADMIN, ADMIN)
 * ------------------------------------------------------------------ */

export interface StaffRegisterRequest {
  username: string
  password: string
  email: string
  yardId: number
}

export interface StaffAddByAdminRequest {
  username: string
  password: string
  email: string
}

export interface StaffMember {
  id: number
  username: string
  email: string
}

/* ------------------------------------------------------------------ *
 * Car service — /car, /metal
 * ------------------------------------------------------------------ */

export interface CarPriceRequest {
  name: string
  registrationYear: number
  vehicleType: VehicleType
  fuelType: FuelType
  city: CarCity
}

export interface CarPriceResponse {
  id: number
  name: string
  registrationYear: number
  vehicleType: VehicleType
  /** NOTE: despite the name, this is a year count, not a timestamp. */
  dateOfExpire: number
  fuelType: FuelType
  city: CarCity
  estimatePrice: number
  eligible: boolean
}

export interface MetalPrice {
  steel: number
  aluminum: number
  copper: number
  iron: number
  plastic: number
  rubber: number
  electronics: number
  lead: number
}

/* ------------------------------------------------------------------ *
 * Yard service — /search, /yard, /management/yard
 * ------------------------------------------------------------------ */

export interface Yard {
  yardId: number
  name: string
  city: string
  state: string
  country: string
  pincode: string
  managedBy: string | null
  contactNo: string
  email: string
  status: YardStatus
}

export interface YardSearchRequest {
  name?: string
  city?: string
  state?: string
  pincode?: string
}

export interface YardCreateRequest {
  name: string
  city: string
  state: string
  country: string
  pincode: string
  contactNo: string
  email: string
  status: YardStatus
}

export interface YardEditRequest {
  yardId: number
  name?: string
  contactNo?: string
  email?: string
  status?: string
}

export interface YardStatusChangeRequest {
  yardId: number
  status: YardStatus
}

export interface YardContactChangeRequest {
  yardId: number
  Contact: string
  email: string
}

/* ------------------------------------------------------------------ *
 * Booking service — /appointment, /management/booking
 * ------------------------------------------------------------------ */

export interface Appointment {
  id: number
  userName: string
  carDetailsId: number
  staffUsername: string | null
  dateOfAppointment: string
  status: BookingStatus
  userMobileNo: string
}

export interface BookingRequest {
  carDetailId: number
  yardId: number
  dateOfAppointment: string
  mobileNo: string
}

export interface AppointmentDetails {
  carname: string
  expireYear: string
  yardName: string
  city: string
}

export interface AppointmentCancelRequest {
  id: number
  reason: string
}

export interface AppointmentPostponeRequest {
  appointmentId: number
  date: string
}

export interface AppointmentStatusRequest {
  appointmentId: number
  status: BookingStatus
}

export interface StaffAssignToAppointmentRequest {
  appointmentId: number
  staffId: number
}

export interface RemoveAssignedStaffRequest {
  appointmentId: number
}