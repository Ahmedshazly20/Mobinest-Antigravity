import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth.store'
import { useAuth } from '@/hooks/useAuth'
import { User } from '@/types/database'
import { ROUTES } from '@/constants/routes'
import { ShieldCheck, Delete, LogOut, User as UserIcon, AlertCircle } from 'lucide-react'

export default function PinPage() {
  const tenant = useAuthStore((state) => state.tenant)
  const isOwnerLoggedIn = useAuthStore((state) => state.isOwnerLoggedIn)
  
  const [employees, setEmployees] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [pin, setPin] = useState('')
  const [fetchingEmployees, setFetchingEmployees] = useState(true)
  
  const { loginWithPin, logoutOwner, loading, error } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOwnerLoggedIn || !tenant) {
      navigate(ROUTES.LOGIN, { replace: true })
      return
    }

    // Fetch active employees for this shop
    async function loadEmployees() {
      try {
        const { data, error: fetchErr } = await supabase
          .from('users')
          .select('*')
          .eq('tenant_id', tenant?.id)
          .eq('is_active', true)
          .eq('is_deleted', false)
          .order('role', { ascending: true })

        if (!fetchErr && data) {
          setEmployees(data as User[])
        }
      } catch (err) {
        console.error('Error fetching employees:', err)
      } finally {
        setFetchingEmployees(false)
      }
    }

    loadEmployees()
  }, [tenant, isOwnerLoggedIn, navigate])

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num
      setPin(nextPin)
      if (nextPin.length === 4) {
        // Auto submit when 4 digits reached
        loginWithPin(nextPin, selectedUserId || undefined)
      }
    }
  }

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1))
  }

  const handleClear = () => {
    setPin('')
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] p-4 dir-rtl">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Shop Name & Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {tenant?.shop_name || 'محل الهواتف'}
              </h2>
              <p className="text-xs text-slate-400">اختر الموظف وادخل رمز PIN للدخول</p>
            </div>
          </div>

          <button
            onClick={logoutOwner}
            className="flex items-center gap-1 text-slate-400 hover:text-red-400 text-xs font-semibold p-2 rounded-xl hover:bg-slate-800/80 transition-colors"
            title="تسجيل خروج المالك"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">خروج المالك</span>
          </button>
        </div>

        {/* Employee List Selector */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-400 mb-2">
            اختر حساب الموظف (اختياري)
          </label>

          {fetchingEmployees ? (
            <div className="flex justify-center py-4">
              <span className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedUserId(null)}
                className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                  selectedUserId === null
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-xs'
                    : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="text-xs font-bold truncate">المالك / المدير</span>
                <span className="text-[10px] text-blue-400 mt-1">رمز 0000 أو رمز الحساب</span>
              </button>

              {employees.map((emp) => (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => setSelectedUserId(emp.id)}
                  className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                    selectedUserId === emp.id
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-xs'
                      : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <UserIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-xs font-bold truncate">{emp.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 capitalize">
                    {emp.role === 'admin'
                      ? 'مدير'
                      : emp.role === 'technician'
                      ? 'فني صيانة'
                      : 'كاشير'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 bg-red-950/60 border border-red-800/60 rounded-xl flex items-center justify-center gap-2 text-red-300 text-xs font-semibold animate-bounce">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* PIN Display Dots */}
        <div className="flex items-center justify-center gap-4 my-6">
          {[0, 1, 2, 3].map((idx) => {
            const filled = pin.length > idx
            return (
              <div
                key={idx}
                className={`w-5 h-5 rounded-full border-2 transition-all transform ${
                  filled
                    ? 'bg-blue-500 border-blue-400 scale-110 shadow-lg shadow-blue-500/50'
                    : 'bg-slate-800 border-slate-700'
                }`}
              />
            )
          })}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              disabled={loading}
              className="h-14 bg-slate-800/90 hover:bg-slate-700 active:bg-blue-600 text-white text-xl font-black rounded-2xl border border-slate-700/80 transition-all shadow-md active:scale-95 flex items-center justify-center"
            >
              {num}
            </button>
          ))}

          <button
            type="button"
            onClick={handleClear}
            className="h-14 bg-red-950/40 hover:bg-red-900/60 text-red-400 text-sm font-bold rounded-2xl border border-red-900/40 transition-all flex items-center justify-center active:scale-95"
          >
            مسح
          </button>

          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            disabled={loading}
            className="h-14 bg-slate-800/90 hover:bg-slate-700 active:bg-blue-600 text-white text-xl font-black rounded-2xl border border-slate-700/80 transition-all shadow-md active:scale-95 flex items-center justify-center"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="h-14 bg-slate-800/90 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700/80 transition-all flex items-center justify-center active:scale-95"
            title="تراجع"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
