import { api } from './client'
import type {
  AdminFlowResponse,
  AdminListItem,
  AdminRegisterRequest,
  LoginRequest,
  LoginResponse,
  MessageResponse,
  OtpRequestPayload,
  PasswordResetRequest,
  RegisterRequest,
  StaffAddByAdminRequest,
  StaffMember,
  StaffRegisterRequest,
  VerifyAccountRequest,
} from '@/types/api'

/** Public + account-lifecycle endpoints under /auth and /guest. */
export const authApi = {
  register: (body: RegisterRequest) =>
    api.post<MessageResponse>('/auth/register', body, { anonymous: true }),

  verifyAccount: (body: VerifyAccountRequest) =>
    api.post<MessageResponse>('/auth/account-verified', body, { anonymous: true }),

  login: (body: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', body, { anonymous: true }),

  /** Creates a throwaway GUEST account and returns a usable JWT. */
  guestLogin: () =>
    api.post<LoginResponse>('/guest/register', undefined, { anonymous: true }),

  requestPasswordResetOtp: (body: OtpRequestPayload) =>
    api.post<MessageResponse>('/auth/otp-request-password-reset', body, { anonymous: true }),

  resetPassword: (body: PasswordResetRequest) =>
    api.post<MessageResponse>('/auth/password-change', body, { anonymous: true }),
}

/** SUPER_ADMIN only — /admin. */
export const adminApi = {
  register: (body: AdminRegisterRequest) =>
    api.post<AdminFlowResponse>('/admin/register', body),

  getAll: () => api.list<AdminListItem>('/admin/getAll'),
}

/** SUPER_ADMIN + ADMIN — /staff. */
export const staffApi = {
  /** SUPER_ADMIN registers staff without a yard assignment. */
  register: (body: StaffRegisterRequest) =>
    api.post<StaffMember>('/staff/register', body),

  /** ADMIN registers staff scoped to their own yard. */
  registerByAdmin: (body: StaffAddByAdminRequest) =>
    api.post<StaffMember>('/staff/register/by/admin', body),

  getAll: () => api.list<StaffMember>('/staff/getAll'),

  /** ADMIN — staff belonging to the admin's yard. */
  listForAdmin: () => api.postList<StaffMember>('/staff/staff/List'),

  /** Staff assigned to a given yard. */
  inYard: (yardId: number) =>
    api.postList<StaffMember>('/staff/get/yard/staffs', { yardId }),
}