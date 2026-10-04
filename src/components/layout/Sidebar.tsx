import { NavLink } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import {
  LayoutDashboard,
  Package,
  Receipt,
  PlusCircle,
  Users,
  Wrench,
  Landmark,
  ReceiptText,
  Smartphone,
  BarChart3,
  UserCheck,
  Settings,
} from 'lucide-react'

export default function Sidebar() {
  const navItems = [
    { label: 'الرئيسية', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'المخزون', path: ROUTES.INVENTORY, icon: Package },
    { label: 'الفواتير', path: ROUTES.SALES, icon: Receipt },
    { label: 'فاتورة جديدة', path: ROUTES.NEW_INVOICE, icon: PlusCircle },
    { label: 'العملاء', path: ROUTES.CUSTOMERS, icon: Users },
    { label: 'الصيانة', path: ROUTES.MAINTENANCE, icon: Wrench },
    { label: 'الخزينة', path: ROUTES.TREASURY, icon: Landmark },
    { label: 'المصروفات', path: ROUTES.EXPENSES, icon: ReceiptText },
    { label: 'فوري والشحن', path: ROUTES.FAWRY, icon: Smartphone },
    { label: 'التقارير', path: ROUTES.REPORTS, icon: BarChart3 },
    { label: 'الموظفين', path: ROUTES.EMPLOYEES, icon: UserCheck },
    { label: 'الإعدادات', path: ROUTES.SETTINGS, icon: Settings },
  ]

  return (
    <aside className="w-64 bg-slate-800 text-slate-100 flex flex-col border-l border-slate-700">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-400">MobiNest</h1>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
