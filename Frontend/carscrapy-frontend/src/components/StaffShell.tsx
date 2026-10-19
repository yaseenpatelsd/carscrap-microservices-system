import { AppShell, type NavItem } from '@/components/AppShell'
import { Calendar, LayoutDashboard, Store } from 'lucide-react'

const NAV: NavItem[] = [
  { to: '/staff', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/staff/yard', label: 'My Yard', icon: Store },
  { to: '/staff/appointments', label: 'Appointments', icon: Calendar },
]

/** STAFF portal shell. */
export function StaffShell() {
  return <AppShell nav={NAV} portalName="Staff" accent="ink" />
}