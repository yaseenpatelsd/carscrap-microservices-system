import {
  BadgeIndianRupee,
  Calendar,
  CalendarCheck,
  LayoutDashboard,
  Search,
  TrendingUp,
} from 'lucide-react'
import { AppShell, type NavItem } from '@/components/AppShell'

const NAV: NavItem[] = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/yards', label: 'Scrap Yards', icon: Search },
  { to: '/dashboard/book', label: 'Book Appointment', icon: CalendarCheck },
  { to: '/dashboard/requests', label: 'My Requests', icon: TrendingUp },
  { to: '/dashboard/appointments', label: 'My Appointments', icon: Calendar },
]

/** Customer + guest portal (USER / GUEST share these screens). */
export function CustomerShell() {
  return <AppShell nav={NAV} portalName="Customer" accent="brand" />
}

export { BadgeIndianRupee }