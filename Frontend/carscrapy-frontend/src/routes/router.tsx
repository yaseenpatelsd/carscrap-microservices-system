import { AdminShell } from '@/components/AdminShell'
import { CustomerShell } from '@/components/CustomerShell'
import { StaffShell } from '@/components/StaffShell'
import { SuperAdminShell } from '@/components/SuperAdminShell'
import { CUSTOMER_ROLES, ProtectedRoute, PublicOnlyRoute, RequireRole } from '@/routes/guards'
import { NOT_FOUND_META, NotFoundPage } from '@/routes/NotFoundPage'
import { RouteError } from '@/routes/RouteError'
import { RouteFallback } from '@/routes/RouteFallback'
import { useSeo } from '@/lib/useSeo'
import { lazyWithRetry } from '@/lib/lazyWithRetry'
import { Suspense } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import type { ReactNode } from 'react'

/*
 * Routes are code-split so each portal only downloads the pages it needs.
 * lazyWithRetry reloads once if a chunk 404s after a redeploy.
 * Paths, guards, and role rules are unchanged from the original router.
 */
const LoginPage = lazyWithRetry(
  () => import('@/features/auth/LoginPage').then((m) => ({ default: m.LoginPage })),
  'auth/LoginPage',
)
const RegisterPage = lazyWithRetry(
  () => import('@/features/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })),
  'auth/RegisterPage',
)
const VerifyOtpPage = lazyWithRetry(
  () => import('@/features/auth/VerifyOtpPage').then((m) => ({ default: m.VerifyOtpPage })),
  'auth/VerifyOtpPage',
)
const ForgotPasswordPage = lazyWithRetry(
  () => import('@/features/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })),
  'auth/ForgotPasswordPage',
)
const ResetPasswordPage = lazyWithRetry(
  () => import('@/features/auth/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })),
  'auth/ResetPasswordPage',
)

const DashboardPage = lazyWithRetry(
  () => import('@/features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })),
  'dashboard/DashboardPage',
)
const YardsPage = lazyWithRetry(
  () => import('@/features/dashboard/YardsPage').then((m) => ({ default: m.YardsPage })),
  'dashboard/YardsPage',
)
const BookPage = lazyWithRetry(
  () => import('@/features/dashboard/BookPage').then((m) => ({ default: m.BookPage })),
  'dashboard/BookPage',
)
const RequestsPage = lazyWithRetry(
  () => import('@/features/dashboard/RequestsPage').then((m) => ({ default: m.RequestsPage })),
  'dashboard/RequestsPage',
)
const AppointmentsPage = lazyWithRetry(
  () => import('@/features/dashboard/AppointmentsPage').then((m) => ({ default: m.AppointmentsPage })),
  'dashboard/AppointmentsPage',
)

const AdminDashboardPage = lazyWithRetry(
  () => import('@/features/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })),
  'admin/AdminDashboardPage',
)
const AdminManageStaffPage = lazyWithRetry(
  () => import('@/features/admin/ManageStaffPage').then((m) => ({ default: m.AdminManageStaffPage })),
  'admin/ManageStaffPage',
)
const AdminAddStaffPage = lazyWithRetry(
  () => import('@/features/admin/AddStaffPage').then((m) => ({ default: m.AdminAddStaffPage })),
  'admin/AddStaffPage',
)
const AdminManageYardPage = lazyWithRetry(
  () => import('@/features/admin/ManageYardPage').then((m) => ({ default: m.AdminManageYardPage })),
  'admin/ManageYardPage',
)
const ManageAppointmentsPage = lazyWithRetry(
  () =>
    import('@/features/admin/ManageAppointmentsPage').then((m) => ({
      default: m.ManageAppointmentsPage,
    })),
  'admin/ManageAppointmentsPage',
)

const StaffDashboardPage = lazyWithRetry(
  () => import('@/features/staff/StaffPages').then((m) => ({ default: m.StaffDashboardPage })),
  'staff/StaffDashboardPage',
)
const StaffYardPage = lazyWithRetry(
  () => import('@/features/staff/StaffPages').then((m) => ({ default: m.StaffYardPage })),
  'staff/StaffYardPage',
)

const SuperAdminDashboardPage = lazyWithRetry(
  () =>
    import('@/features/superadmin/SuperAdminDashboardPage').then((m) => ({
      default: m.SuperAdminDashboardPage,
    })),
  'superadmin/SuperAdminDashboardPage',
)
const SuperAdminAdminsPage = lazyWithRetry(
  () =>
    import('@/features/superadmin/SuperAdminAdminsPage').then((m) => ({
      default: m.SuperAdminAdminsPage,
    })),
  'superadmin/SuperAdminAdminsPage',
)
const SuperAdminStaffPage = lazyWithRetry(
  () =>
    import('@/features/superadmin/SuperAdminStaffPage').then((m) => ({
      default: m.SuperAdminStaffPage,
    })),
  'superadmin/SuperAdminStaffPage',
)
const SuperAdminYardsPage = lazyWithRetry(
  () =>
    import('@/features/superadmin/SuperAdminYardsPage').then((m) => ({
      default: m.SuperAdminYardsPage,
    })),
  'superadmin/SuperAdminYardsPage',
)
const SuperAdminAddYardPage = lazyWithRetry(
  () =>
    import('@/features/superadmin/SuperAdminAddYardPage').then((m) => ({
      default: m.SuperAdminAddYardPage,
    })),
  'superadmin/SuperAdminAddYardPage',
)
const SuperAdminMetalPage = lazyWithRetry(
  () =>
    import('@/features/superadmin/SuperAdminMetalPage').then((m) => ({
      default: m.SuperAdminMetalPage,
    })),
  'superadmin/SuperAdminMetalPage',
)

const PublicLayout = lazyWithRetry(
  () => import('@/features/public/PublicLayout').then((m) => ({ default: m.PublicLayout })),
  'public/PublicLayout',
)
const LandingPage = lazyWithRetry(
  () => import('@/features/public/LandingPage').then((m) => ({ default: m.LandingPage })),
  'public/LandingPage',
)
const AboutPage = lazyWithRetry(
  () => import('@/features/public/AboutPage').then((m) => ({ default: m.AboutPage })),
  'public/AboutPage',
)
const ArchitecturePage = lazyWithRetry(
  () => import('@/features/public/ArchitecturePage').then((m) => ({ default: m.ArchitecturePage })),
  'public/ArchitecturePage',
)

/** Wraps a page with Suspense, SEO tags and a document title. */
function page(element: ReactNode, title: string, description?: string, noindex?: boolean) {
  return (
    <TitledRoute title={title} description={description} noindex={noindex}>
      {element}
    </TitledRoute>
  )
}

function TitledRoute({
  title,
  description,
  noindex,
  children,
}: {
  title: string
  description?: string
  noindex?: boolean
  children: ReactNode
}) {
  useSeo({
    title,
    description:
      description ??
      `${title} — CarScrapy, a vehicle scrap valuation and yard booking platform built on Spring Boot microservices.`,
    path: typeof window !== 'undefined' ? window.location.pathname : '/',
    noindex,
  })
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  {
    // Catches render errors from any route (including failed chunks).
    errorElement: <RouteError />,
    children: [
      // Public marketing + portfolio pages (reachable signed in or out).
      {
        element: (
          <Suspense fallback={<RouteFallback />}>
            <PublicLayout />
          </Suspense>
        ),
        children: [
          { index: true, element: page(<LandingPage />, 'Vehicle Scrap Valuation & Yard Booking', 'CarScrapy estimates your car’s scrap value in seconds, connects you with certified recyclers and books the inspection — built on Spring Boot microservices by Yaseen Patel.') },
          { path: 'about', element: page(<AboutPage />, 'About the Developer', 'Yaseen Patel — Java backend developer who built the CarScrapy microservices backend: seven Spring Boot services, JWT security, Docker and AWS deployment.') },
          { path: 'architecture', element: page(<ArchitecturePage />, 'System Architecture', 'How CarScrapy is built: Spring Boot microservices, an API Gateway, Eureka service discovery, OpenFeign calls, Resilience4j, MySQL, Docker and an AWS deployment.') },
        ],
      },

      // Convenience redirect for the old root target.
      { path: '/home', element: <Navigate to="/" replace /> },

      // Auth screens — hidden once signed in.
      {
        element: <PublicOnlyRoute />,
        children: [
          { path: '/login', element: page(<LoginPage />, 'Sign in', 'Sign in to CarScrapy to manage your scrap requests and appointments.', true) },
          { path: '/register', element: page(<RegisterPage />, 'Create account', 'Create a CarScrapy account to value your vehicle, find scrap yards and book an inspection.', true) },
          { path: '/verify', element: page(<VerifyOtpPage />, 'Verify OTP', undefined, true) },
          { path: '/forgot-password', element: page(<ForgotPasswordPage />, 'Forgot password', undefined, true) },
          { path: '/reset-password', element: page(<ResetPasswordPage />, 'Reset password', undefined, true) },
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
                  { index: true, element: page(<DashboardPage />, 'Overview', undefined, true) },
                  { path: 'yards', element: page(<YardsPage />, 'Scrap yards', undefined, true) },
                  { path: 'book', element: page(<BookPage />, 'Book appointment', undefined, true) },
                  { path: 'requests', element: page(<RequestsPage />, 'My requests', undefined, true) },
                  { path: 'appointments', element: page(<AppointmentsPage />, 'My appointments', undefined, true) },
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
                  { index: true, element: page(<AdminDashboardPage />, 'Admin overview', undefined, true) },
                  { path: 'staff', element: page(<AdminManageStaffPage />, 'Manage staff', undefined, true) },
                  { path: 'staff/add', element: page(<AdminAddStaffPage />, 'Add staff', undefined, true) },
                  { path: 'yard', element: page(<AdminManageYardPage />, 'Manage yard', undefined, true) },
                  {
                    path: 'appointments',
                    element: page(<ManageAppointmentsPage mode="admin" />, 'Appointments', undefined, true),
                  },
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
                  { index: true, element: page(<StaffDashboardPage />, 'Staff overview', undefined, true) },
                  { path: 'yard', element: page(<StaffYardPage />, 'My yard', undefined, true) },
                  {
                    path: 'appointments',
                    element: page(<ManageAppointmentsPage mode="staff" />, 'Appointments', undefined, true),
                  },
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
                  { index: true, element: page(<SuperAdminDashboardPage />, 'Super admin overview', undefined, true) },
                  { path: 'admins', element: page(<SuperAdminAdminsPage />, 'Admins', undefined, true) },
                  { path: 'staff', element: page(<SuperAdminStaffPage />, 'Staff', undefined, true) },
                  { path: 'yards', element: page(<SuperAdminYardsPage />, 'Scrap yards', undefined, true) },
                  { path: 'yards/add', element: page(<SuperAdminAddYardPage />, 'Add yard', undefined, true) },
                  { path: 'metal', element: page(<SuperAdminMetalPage />, 'Metal prices', undefined, true) },
                ],
              },
            ],
          },
        ],
      },

      { path: '*', element: page(<NotFoundPage />, NOT_FOUND_META, undefined, true) },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
