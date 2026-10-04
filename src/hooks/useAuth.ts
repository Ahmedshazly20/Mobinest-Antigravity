import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth.store'
import { ROUTES } from '@/constants/routes'
import { Tenant, User } from '@/types/database'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const setSession = useAuthStore((state) => state.setSession)
  const setTenant = useAuthStore((state) => state.setTenant)
  const setActiveUser = useAuthStore((state) => state.setActiveUser)
  const logoutEmployeeState = useAuthStore((state) => state.logoutEmployee)
  const logoutOwnerState = useAuthStore((state) => state.logoutOwner)
  const tenant = useAuthStore((state) => state.tenant)
  const isOwnerLoggedIn = useAuthStore((state) => state.isOwnerLoggedIn)

  const navigate = useNavigate()

  /**
   * Level 1 Login: Shop Owner Email + Password via Supabase Auth
   */
  const loginOwner = async (email: string, pass: string) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      })

      if (authError) {
        throw new Error(authError.message === 'Invalid login credentials' 
          ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' 
          : authError.message)
      }

      if (!data.user) {
        throw new Error('لم يتم العثور على بيانات المستخدم')
      }

      // Fetch Tenant details for this auth user
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (tenantError || !tenantData) {
        throw new Error('تعذر جلب بيانات المحل الخاص بك')
      }

      if (!tenantData.is_active) {
        throw new Error('اشتراك هذا المحل غير نشط. يرجى التواصل مع الدعم الفني.')
      }

      const activeTenant = tenantData as Tenant

      // Store in Zustand
      setSession(data.session)
      setTenant(activeTenant)

      // Set owner as active user initially by default
      setActiveUser({
        id: activeTenant.id,
        name: activeTenant.owner_name,
        role: 'admin',
      })

      // Navigate to PIN login screen so employees/owner enter their PIN
      navigate(ROUTES.PIN, { replace: true })
      return { success: true }
    } catch (err: any) {
      const msg = err.message || 'حدث خطأ غير متوقع أثناء تسجيل الدخول'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Level 2 Login: Employee / Owner PIN Authentication
   */
  const loginWithPin = async (pinCode: string, selectedUserId?: string) => {
    setLoading(true)
    setError(null)
    try {
      if (!isOwnerLoggedIn || !tenant) {
        throw new Error('يجب تسجيل دخول المالك أولاً')
      }

      let query = supabase
        .from('users')
        .select('*')
        .eq('pin_code', pinCode)
        .eq('is_active', true)
        .eq('is_deleted', false)

      if (selectedUserId) {
        query = query.eq('id', selectedUserId)
      }

      const { data: employees, error: fetchError } = await query

      if (fetchError) {
        throw new Error('حدث خطأ أثناء فحص رمز PIN')
      }

      let userMatch: User | null = null

      if (employees && employees.length > 0) {
        userMatch = employees[0] as User
      }

      // If no employee matched the PIN, check if it matches the Master PIN '0000' or default admin PIN
      if (!userMatch) {
        if (pinCode === '0000') {
          // Master Admin Fallback
          setActiveUser({
            id: tenant.id,
            name: tenant.owner_name,
            role: 'admin',
          })
          navigate(ROUTES.DASHBOARD, { replace: true })
          return { success: true }
        }
        throw new Error('رمز PIN غير صحيح')
      }

      // Successful Employee PIN authentication
      setActiveUser({
        id: userMatch.id,
        name: userMatch.name,
        role: userMatch.role,
        pinCode: userMatch.pin_code,
      })

      navigate(ROUTES.DASHBOARD, { replace: true })
      return { success: true }
    } catch (err: any) {
      const msg = err.message || 'رمز الـ PIN غير صحيح'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Switch active employee -> returns to PIN screen
   */
  const switchEmployee = () => {
    logoutEmployeeState()
    navigate(ROUTES.PIN, { replace: true })
  }

  /**
   * Full Owner Sign Out -> terminates Supabase session
   */
  const logoutOwner = async () => {
    await supabase.auth.signOut()
    logoutOwnerState()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return {
    loading,
    error,
    loginOwner,
    loginWithPin,
    switchEmployee,
    logoutOwner,
  }
}
