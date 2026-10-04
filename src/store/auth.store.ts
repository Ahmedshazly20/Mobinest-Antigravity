import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Session } from '@supabase/supabase-js'
import { Tenant } from '@/types/database'

export interface ActiveUser {
  id: string
  name: string
  role: 'admin' | 'cashier' | 'technician'
  pinCode?: string
}

interface AuthState {
  session: Session | null
  tenant: Tenant | null
  activeUser: ActiveUser | null
  isAuthenticated: boolean
  isOwnerLoggedIn: boolean

  setSession: (session: Session | null) => void
  setTenant: (tenant: Tenant | null) => void
  setActiveUser: (user: ActiveUser | null) => void
  logoutEmployee: () => void
  logoutOwner: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      tenant: null,
      activeUser: null,
      isAuthenticated: false,
      isOwnerLoggedIn: false,

      setSession: (session) =>
        set((state) => ({
          session,
          isOwnerLoggedIn: !!session,
          isAuthenticated: !!session && !!state.activeUser,
        })),

      setTenant: (tenant) =>
        set({
          tenant,
        }),

      setActiveUser: (user) =>
        set((state) => ({
          activeUser: user,
          isAuthenticated: !!state.session && !!user,
        })),

      logoutEmployee: () =>
        set((state) => ({
          activeUser: state.tenant
            ? {
                id: state.tenant.id,
                name: state.tenant.owner_name,
                role: 'admin',
              }
            : null,
          isAuthenticated: !!state.session,
        })),

      logoutOwner: () =>
        set({
          session: null,
          tenant: null,
          activeUser: null,
          isAuthenticated: false,
          isOwnerLoggedIn: false,
        }),
    }),
    {
      name: 'mobinest-auth-session',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
