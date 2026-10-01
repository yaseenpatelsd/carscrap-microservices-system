import { AdminShell } from '@/components/AdminShell'
import { CustomerShell } from '@/components/CustomerShell'
import { StaffShell } from '@/components/StaffShell'
import { SuperAdminShell } from '@/components/SuperAdminShell'
import { AdminAddStaffPage } from '@/features/admin/AddStaffPage'
import { AdminDashboardPage } from '@/features/admin/AdminDashboardPage'
import { ManageAppointmentsPage } from '@/features/admin/ManageAppointmentsPage'
import { AdminManageStaffPage } from '@/features/admin/ManageStaffPage'
import { AdminManageYardPage } from '@/features/admin/ManageYardPage'
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage'
import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
import { ResetPasswordPage } from '@/features/auth/ResetPasswordPage'
import { VerifyOtpPage } from '@/features/auth/VerifyOtpPage'
import { AppointmentsPage } from '@/features/dashboard/AppointmentsPage'
import { BookPage } from '@/features/dashboard/BookPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { RequestsPage } from '@/features/dashboard/RequestsPage'
import { YardsPage } from '@/features/dashboard/YardsPage'
import { StaffDashboardPage, StaffYardPage } from '@/features/staff/StaffPages'
import { SuperAdminAddYardPage } from '@/features/superadmin/SuperAdminAddYardPage'
import { SuperAdminAdminsPage } from '@/features/superadmin/SuperAdminAdminsPage'
import { SuperAdminDashboardPage } from '@/features/superadmin/SuperAdminDashboardPage'
import { SuperAdminMetalPage } from '@/features/superadmin/SuperAdminMetalPage'
import { SuperAdminStaffPage } from '@/features/superadmin/SuperAdminStaffPage'
import { SuperAdminYardsPage } from '@/features/superadmin/SuperAdminYardsPage'
import { CUSTOMER_ROLES, ProtectedRoute, PublicOnlyRoute, RequireRole } from '@/routes/guards'
import { NotFoundPage } from '@/routes/NotFoundPage'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },

  // Auth screens — hidden once signed in.
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/verify', element: <VerifyOtpPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
    ],
  },

  // Customer + guest — to sign in with the same screens.
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RequireRole allow={CUSTOMER_ROLES} />,
        children: [
          {
            path: '/dashboard',
            element: <CustomerShell />,
            children: [
              { index: true, element: <DashboardPage /> },
              { path: 'yards', element: <YardsPage /> },
              { path: 'book', element: <BookPage /> },
              { path: 'requests', element: <RequestsPage /> },
              { path: 'appointments', element: <AppointmentsPage /> },
            ],
          },
        ],
      },

      // ADMIN portal.
      {
        element: <RequireRole allow={['ADMIN']} />,
        children: [
          {
            path: '/admin',
            element: <AdminShell />,
            children: [
              { index: true, element: <AdminDashboardPage /> },
              { path: 'staff', element: <AdminManageStaffPage /> },
              { path: 'staff/add', element: <AdminAddStaffPage /> },
              { path: 'yard', element: <AdminManageYardPage /> },
              { path: 'appointments', element: <ManageAppointmentsPage mode="admin" /> },
            ],
          },
        ],
      },

      // STAFF portal.
      {
        element: <RequireRole allow={['STAFF']} />,
        children: [
          {
            path: '/staff',
            element: <StaffShell />,
            children: [
              { index: true, element: <StaffDashboardPage /> },
              { path: 'yard', element: <StaffYardPage /> },
              { path: 'appointments', element: <ManageAppointmentsPage mode="staff" /> },
            ],
          },
        ],
      },

      // SUPER_ADMIN portal.
      {
        element: <RequireRole allow={['SUPER_ADMIN']} />,
        children: [
          {
            path: '/super-admin',
            element: <SuperAdminShell />,
            children: [
              { index: true, element: <SuperAdminDashboardPage /> },
              { path: 'admins', element: <SuperAdminAdminsPage /> },
              { path: 'staff', element: <SuperAdminStaffPage /> },
              { path: 'yards', element: <SuperAdminYardsPage /> },
              { path: 'yards/add', element: <SuperAdminAddYardPage /> },
              { path: 'metal', element: <SuperAdminMetalPage /> },
            ],
          },
        ],
      },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}