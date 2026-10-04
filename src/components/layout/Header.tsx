import { useAuthStore } from '@/store/auth.store'
import { LogOut, User } from 'lucide-react'

export default function Header() {
  const activeUser = useAuthStore((state) => state.activeUser)
  const tenant = useAuthStore((state) => state.tenant)
  const logoutEmployee = useAuthStore((state) => state.logoutEmployee)

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-slate-800">
          {tenant?.shop_name || 'محل الهواتف'}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700">
          <User className="w-4 h-4 text-slate-500" />
          <span>{activeUser?.name || 'مستخدم'}</span>
          <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-semibold">
            {activeUser?.role || 'cashier'}
          </span>
        </div>

        <button
          onClick={logoutEmployee}
          className="flex items-center gap-1 text-slate-500 hover:text-red-600 text-xs font-medium transition-colors"
          title="تغيير المستخدم"
        >
          <LogOut className="w-4 h-4" />
          <span>تبديل المستخدم</span>
        </button>
      </div>
    </header>
  )
}
