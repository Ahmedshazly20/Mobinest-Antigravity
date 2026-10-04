import { useAuthStore } from '@/store/auth.store'
import { useAuth } from '@/hooks/useAuth'
import { ROLE_LABELS, Role } from '@/constants/roles'
import {
  User,
  LogOut,
  RefreshCw,
  Minus,
  Square,
  X,
  Store,
} from 'lucide-react'

export default function Header() {
  const activeUser = useAuthStore((state) => state.activeUser)
  const tenant = useAuthStore((state) => state.tenant)
  const { switchEmployee, logoutOwner } = useAuth()

  const handleMinimize = () => {
    window.electron?.minimizeWindow()
  }

  const handleMaximize = () => {
    window.electron?.maximizeWindow()
  }

  const handleClose = () => {
    window.electron?.closeWindow()
  }

  const userRole = (activeUser?.role || 'cashier') as Role

  const roleBadgeColors: Record<Role, string> = {
    admin: 'bg-purple-100 text-purple-700 border-purple-200',
    cashier: 'bg-blue-100 text-blue-700 border-blue-200',
    technician: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 select-none z-20 shadow-xs">
      {/* Left (RTL Right): Shop Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-700">
          <Store className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 leading-tight">
            {tenant?.shop_name || 'محل الهواتف'}
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            المالك: {tenant?.owner_name || 'صاحب المحل'}
          </p>
        </div>
      </div>

      {/* Right (RTL Left): Active User Info & Controls */}
      <div className="flex items-center gap-4">
        {/* Active User Badge */}
        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-full">
          <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-600 shadow-2xs">
            <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800 leading-none mb-0.5">
              {activeUser?.name || 'مستخدم'}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.2 rounded-full border leading-tight ${roleBadgeColors[userRole]}`}
            >
              {ROLE_LABELS[userRole] || userRole}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
          <button
            onClick={switchEmployee}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors"
            title="تبديل المستخدم النشط بـ PIN"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>تبديل الموظف</span>
          </button>

          <button
            onClick={logoutOwner}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
            title="إنهاء جلسة المالك بالكامل"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج المالك</span>
          </button>
        </div>

        {/* Window Controls (Electron desktop) */}
        {window.electron && (
          <div className="flex items-center gap-1 border-r border-slate-200 pr-3 mr-1">
            <button
              onClick={handleMinimize}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              title="تصغير"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={handleMaximize}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              title="تكبير"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
