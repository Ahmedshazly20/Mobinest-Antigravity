export const ROLES = {
  ADMIN: 'admin',
  CASHIER: 'cashier',
  TECHNICIAN: 'technician',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'مدير المحل (مالك)',
  cashier: 'كاشير / مبيعات',
  technician: 'فني صيانة',
}
