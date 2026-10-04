import { NavLink } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/store/auth.store'
import { useUIStore } from '@/store/ui.store'
import { Role } from '@/constants/roles'
import { PERMISSIONS, PermissionKey } from '@/constants/permissions'
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
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface NavItem {
  label: string
  path: string
  icon: any
  permission?: PermissionKey
}

export default function Sidebar() {
  const activeUser = useAuthStore((state) => state.activeUser)
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)

  const userRole = (activeUser?.role || 'cashier') as Role

  const navItems: NavItem[] = [
    { label: 'الرئيسية', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'المخزون والمنتجات', path: ROUTES.INVENTORY, icon: Package, permission: 'VIEW_INVENTORY' },
    { label: 'سجل الفواتير', path: ROUTES.SALES, icon: Receipt },
    { label: 'فاتورة جديدة', path: ROUTES.NEW_INVOICE, icon: PlusCircle, permission: 'CREATE_INVOICE' },
    { label: 'دليل العملاء', path: ROUTES.CUSTOMERS, icon: Users },
    { label: 'قسم الصيانة', path: ROUTES.MAINTENANCE, icon: Wrench, permission: 'VIEW_MAINTENANCE' },
    { label: 'الخزينة والحسابات', path: ROUTES.TREASURY, icon: Landmark, permission: 'VIEW_TREASURY' },
    { label: 'بند المصروفات', path: ROUTES.EXPENSES, icon: ReceiptText, permission: 'ADD_EXPENSES' },
    { label: 'فوري والشحن', path: ROUTES.FAWRY, icon: Smartphone },
    { label: 'التقارير المالية', path: ROUTES.REPORTS, icon: BarChart3, permission: 'VIEW_REPORTS' },
    { label: 'إدارة الموظفين', path: ROUTES.EMPLOYEES, icon: UserCheck, permission: 'MANAGE_USERS' },
    { label: 'إعدادات النظام', path: ROUTES.SETTINGS, icon: Settings, permission: 'MANAGE_SETTINGS' },
  ]

  // Filter items based on permission matrix
  const allowedNavItems = navItems.filter((item) => {
    if (!item.permission) return true
    const allowed = PERMISSIONS[item.permission]
    return allowed ? allowed.includes(userRole) : true
  })

  return (
    <aside
      className={cn(
        'bg-slate-900 text-slate-100 flex flex-col border-l border-slate-800 transition-all duration-300 z-30 shrink-0 select-none',
        isSidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Brand & Toggle Header */}
      <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between">
        {isSidebarOpen ? (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md shadow-blue-600/30">
              MN
            </div>
            <h1 className="text-lg font-black tracking-tight text-white">
              Mobi<span className="text-blue-500">Nest</span>
            </h1>
          </div>
        ) : (
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md shadow-blue-600/30 mx-auto">
            MN
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title={isSidebarOpen ? 'طي القائمة' : 'توسيع القائمة'}
        >
          {isSidebarOpen ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {allowedNavItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group',
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 font-bold'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100',
                  !isSidebarOpen && 'justify-center px-0'
                )
              }
              title={!isSidebarOpen ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
              {isSidebarOpen && <span className="truncate">{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer info */}
      {isSidebarOpen && (
        <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
          MobiNest Desktop v1.0.0
        </div>
      )}
    </aside>
  )
}
