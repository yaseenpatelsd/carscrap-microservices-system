import { AppShell, type NavItem } from '@/components/AppShell'
import {
  Coins,
  LayoutDashboard,
  ShieldPlus,
  Store,
  UserCog,
  Users,
} from 'lucide-react'

const NAV: NavItem[] = [
  { to: '/super-admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/super-admin/admins', label: 'Admins', icon: ShieldPlus },
  { to: '/super-admin/staff', label: 'Staff', icon: Users },
  { to: '/super-admin/yards/add', label: 'Add Yard', icon: Store, end: true },
  { to: '/super-admin/yards', label: 'Scrap Yards', icon: UserCog, end: true },
  { to: '/super-admin/metal', label: 'Metal Prices', icon: Coins },
]

/** SUPER_ADMIN portal shell. */
export function SuperAdminShell() {
  return <AppShell nav={NAV} portalName="Super admin" accent="brand" />
}