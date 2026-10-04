import { Role } from './roles'

export const PERMISSIONS = {
  // Inventory
  VIEW_INVENTORY: ['admin', 'cashier', 'technician'] as Role[],
  MANAGE_INVENTORY: ['admin'] as Role[],
  VIEW_COST_PRICE: ['admin'] as Role[],

  // Sales
  CREATE_INVOICE: ['admin', 'cashier'] as Role[],
  DELETE_INVOICE: ['admin'] as Role[],
  SELL_BELOW_COST: ['admin'] as Role[],
  EDIT_PRICES: ['admin'] as Role[],

  // Financial
  VIEW_TREASURY: ['admin'] as Role[],
  MANAGE_TREASURY: ['admin'] as Role[],
  VIEW_REPORTS: ['admin'] as Role[],
  ADD_EXPENSES: ['admin', 'cashier'] as Role[],

  // Maintenance
  VIEW_MAINTENANCE: ['admin', 'cashier', 'technician'] as Role[],
  UPDATE_MAINTENANCE: ['admin', 'technician'] as Role[],

  // Settings
  MANAGE_SETTINGS: ['admin'] as Role[],
  MANAGE_USERS: ['admin'] as Role[],
} as const

export type PermissionKey = keyof typeof PERMISSIONS
