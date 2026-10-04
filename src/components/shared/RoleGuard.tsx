import { ReactNode } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { Role } from '@/constants/roles'
import { PERMISSIONS, PermissionKey } from '@/constants/permissions'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles?: Role[]
  permission?: PermissionKey
  fallback?: ReactNode
}

export default function RoleGuard({
  children,
  allowedRoles,
  permission,
  fallback = null,
}: RoleGuardProps) {
  const activeUser = useAuthStore((state) => state.activeUser)

  if (!activeUser) {
    return <>{fallback}</>
  }

  const userRole = activeUser.role as Role

  // 1. Check explicit permission key if specified
  if (permission) {
    const requiredRoles = PERMISSIONS[permission]
    if (requiredRoles && requiredRoles.includes(userRole)) {
      return <>{children}</>
    }
    return <>{fallback}</>
  }

  // 2. Check direct allowed roles array if specified
  if (allowedRoles && allowedRoles.length > 0) {
    if (allowedRoles.includes(userRole)) {
      return <>{children}</>
    }
    return <>{fallback}</>
  }

  // If neither specified, default render
  return <>{children}</>
}
