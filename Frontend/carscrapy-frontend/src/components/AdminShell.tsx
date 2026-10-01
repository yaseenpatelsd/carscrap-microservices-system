import { AppShell, type NavItem } from '@/components/AppShell'
import { Calendar, LayoutDashboard, Store, UserPlus, Users } from 'lucide-react'

const NAV: NavItem[] = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/staff/add', label: 'Add Staff', icon: UserPlus },
  { to: '/admin/staff', label: 'Manage Staff', icon: Users, end: true },
  { to: '/admin/yard', label: 'Manage Yard', icon: Store },
  { to: '/admin/appointments', label: 'Appointments', icon: Calendar },
]

/** ADMIN portal shell. */
export function AdminShell() {
  return <AppShell nav={NAV} portalName="Admin" accent="sky" />
}