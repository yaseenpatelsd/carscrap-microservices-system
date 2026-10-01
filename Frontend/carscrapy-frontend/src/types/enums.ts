/**
 * Single source of truth for every enum the backend accepts.
 *
 * These MUST match the Java enums exactly, character for character.
 * Every dropdown and every request payload imports from here, so the
 * frontend and backend can never drift apart.
 */

export const VEHICLE_TYPES = ['HATCHBACK', 'SEDAN', 'SUV'] as const
export type VehicleType = (typeof VEHICLE_TYPES)[number]

export const FUEL_TYPES = ['PETROL', 'DIESEL', 'CNG'] as const
export type FuelType = (typeof FUEL_TYPES)[number]

/** car-service `City` enum — used for price estimation. */
export const CAR_CITIES = [
  'MUMBAI',
  'DELHI',
  'BANGALORE',
  'CHENNAI',
  'HYDERABAD',
  'KOLKATA',
  'PUNE',
] as const
export type CarCity = (typeof CAR_CITIES)[number]

/** Booking-service `Status`. */
export const BOOKING_STATUSES = ['PENDING', 'CONFIRM', 'CANCEL', 'SUCCESSFUL'] as const
export type BookingStatus = (typeof BOOKING_STATUSES)[number]

/** yard-service `Status`. */
export const YARD_STATUSES = ['ACTIVE', 'INACTIVE', 'UNDERMAINTENANCE'] as const
export type YardStatus = (typeof YARD_STATUSES)[number]

export const ROLES = ['USER', 'ADMIN', 'SUPER_ADMIN', 'STAFF', 'GUEST'] as const
export type Role = (typeof ROLES)[number]

/** IndianStates — yard-service. */
export const INDIAN_STATES = [
  'MAHARASHTRA',
  'DELHI',
  'KARNATAKA',
  'TAMIL_NADU',
  'TELANGANA',
  'WEST_BENGAL',
  'GUJARAT',
  'RAJASTHAN',
  'UTTAR_PRADESH',
  'MADHYA_PRADESH',
  'PUNJAB',
  'BIHAR',
  'KERALA',
  'ODISHA',
  'ASSAM',
] as const
export type IndianState = (typeof INDIAN_STATES)[number]

/** IndianCity — yard-service. Note: this is a DIFFERENT enum from CAR_CITIES. */
export const INDIAN_CITIES = [
  'MUMBAI', 'PUNE', 'NAGPUR', 'NASHIK', 'AURANGABAD',
  'NEW_DELHI', 'DELHI',
  'BANGALORE', 'MYSORE', 'MANGALORE',
  'CHENNAI', 'COIMBATORE', 'MADURAI',
  'HYDERABAD', 'WARANGAL',
  'KOLKATA', 'HOWRAH',
  'AHMEDABAD', 'SURAT', 'VADODARA', 'RAJKOT',
  'JAIPUR', 'UDAIPUR', 'JODHPUR',
  'LUCKNOW', 'KANPUR', 'AGRA', 'VARANASI', 'NOIDA',
  'INDORE', 'BHOPAL', 'GWALIOR',
  'AMRITSAR', 'LUDHIANA',
  'PATNA', 'GAYA',
  'KOCHI', 'THIRUVANANTHAPURAM', 'KOZHI KODE',
  'BHUBANESWAR', 'CUTTACK',
  'GUWAHATI',
] as const
export type IndianCity = (typeof INDIAN_CITIES)[number]

/** yard-service `Country` enum. */
export const COUNTRIES = ['INDIA'] as const
export type Country = (typeof COUNTRIES)[number]

/** Turns SCREAMING_SNAKE enum values into readable labels. */
export function label(value: string): string {
  return value
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ')
}

/** Tailwind classes for each booking status pill. */
export const BOOKING_STATUS_TONE: Record<BookingStatus, string> = {
  PENDING: 'border-amber-200 bg-amber-50 text-amber-700',
  CONFIRM: 'border-sky-200 bg-sky-50 text-sky-700',
  CANCEL: 'border-red-200 bg-red-50 text-red-700',
  SUCCESSFUL: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

/** Safe lookup that tolerates unknown values from the API. */
export function bookingTone(status?: string | null): string {
  return (
    BOOKING_STATUS_TONE[(status ?? '') as BookingStatus] ?? 'border-ink-200 bg-ink-100 text-ink-600'
  )
}

/** Tailwind classes for each yard status pill. */
export const YARD_STATUS_TONE: Record<YardStatus, string> = {
  ACTIVE: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  INACTIVE: 'border-ink-200 bg-ink-100 text-ink-600',
  UNDERMAINTENANCE: 'border-amber-200 bg-amber-50 text-amber-700',
}

/** Safe lookup that tolerates unknown values from the API. */
export function yardTone(status?: string | null): string {
  return YARD_STATUS_TONE[(status ?? '') as YardStatus] ?? 'border-ink-200 bg-ink-100 text-ink-600'
}