export interface Tenant {
  id: string
  shop_name: string
  owner_name: string
  phone: string
  email: string
  address: string | null
  tax_number: string | null
  is_active: boolean
  subscription_plan: string
  subscription_end_date: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  tenant_id: string
  name: string
  phone: string | null
  role: 'admin' | 'cashier' | 'technician'
  pin_code: string
  salary: number
  is_active: boolean
  created_at: string
  updated_at: string
  is_deleted: boolean
}

export interface Category {
  id: string
  tenant_id: string
  name: string
  created_at: string
  updated_at: string
  is_deleted: boolean
}

export interface Supplier {
  id: string
  tenant_id: string
  name: string
  phone: string | null
  address: string | null
  notes: string | null
  created_at: string
  updated_at: string
  is_deleted: boolean
}

export interface Product {
  id: string
  tenant_id: string
  name: string
  code: string | null
  barcode: string | null
  category_id: string | null
  supplier_id: string | null
  cost_price: number
  selling_price: number
  min_selling_price: number
  current_quantity: number
  min_stock_alert: number
  image_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
  is_deleted: boolean
  // Relations
  categories?: { name: string } | null
  suppliers?: { name: string } | null
}

export interface Device {
  id: string
  tenant_id: string
  brand: string
  model: string
  color: string | null
  storage_capacity: string | null
  imei: string
  imei2: string | null
  device_condition: 'new' | 'used'
  cost_price: number
  selling_price: number
  min_selling_price: number
  status: 'in_stock' | 'sold' | 'maintenance'
  supplier_id: string | null
  sold_to_customer_id: string | null
  sold_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
  is_deleted: boolean
  suppliers?: { name: string } | null
  customers?: { name: string } | null
}

export interface Customer {
  id: string
  tenant_id: string
  name: string
  phone: string | null
  address: string | null
  national_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  is_deleted: boolean
}

export interface InvoiceItem {
  type: 'product' | 'device'
  product_id?: string
  device_id?: string
  name: string
  quantity: number
  unit_price: number
  discount: number
  total: number
  imei?: string
}

export interface Invoice {
  id: string
  tenant_id: string
  invoice_number: string
  customer_id: string | null
  customer_name: string | null
  cashier_id: string | null
  cashier_name: string | null
  items: InvoiceItem[]
  subtotal: number
  discount: number
  total: number
  payment_method: 'cash' | 'vodafone' | 'etisalat' | 'wepay' | 'instapay' | 'bank'
  treasury_id: string | null
  status: 'completed' | 'returned' | 'cancelled'
  notes: string | null
  created_at: string
  updated_at: string
  is_deleted: boolean
  treasuries?: { name: string } | null
}

export interface Treasury {
  id: string
  tenant_id: string
  name: string
  type: 'cash' | 'vodafone' | 'etisalat' | 'wepay' | 'instapay' | 'bank'
  balance: number
  wallet_number: string | null
  bank_name: string | null
  account_number: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  is_deleted: boolean
}

export interface TreasuryTransaction {
  id: string
  tenant_id: string
  treasury_id: string
  type: 'in' | 'out' | 'transfer'
  amount: number
  commission: number
  reference_id: string | null
  reference_type: 'invoice' | 'expense' | 'manual' | null
  description: string | null
  user_id: string | null
  user_name: string | null
  created_at: string
  treasuries?: { name: string } | null
}

export interface Expense {
  id: string
  tenant_id: string
  title: string
  category: 'electricity' | 'water' | 'internet' | 'rent' | 'salary' | 'transport' | 'maintenance' | 'cleaning' | 'tax' | 'other'
  amount: number
  treasury_id: string | null
  user_id: string | null
  user_name: string | null
  notes: string | null
  created_at: string
  updated_at: string
  is_deleted: boolean
  treasuries?: { name: string } | null
}

export interface MaintenanceOrder {
  id: string
  tenant_id: string
  order_number: string
  customer_id: string | null
  customer_name: string | null
  customer_phone: string | null
  device_name: string
  device_brand: string | null
  device_model: string | null
  imei: string | null
  problem_description: string
  device_password: string | null
  service_type: 'hardware' | 'software'
  software_service_detail: string | null
  estimated_cost: number
  actual_cost: number
  price_charged: number
  status: 'received' | 'checking' | 'repairing' | 'waiting_parts' | 'done' | 'delivered'
  technician_id: string | null
  technician_name: string | null
  received_at: string
  delivered_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
  is_deleted: boolean
}

export interface FawryBalance {
  id: string
  tenant_id: string
  received_from_agent: number
  used_amount: number
  remaining_balance: number
  last_updated: string
}

export interface FawryTransaction {
  id: string
  tenant_id: string
  service_type: 'recharge' | 'card_small' | 'card_large' | 'electricity' | 'water' | 'gas' | 'other'
  customer_name: string | null
  customer_phone: string | null
  amount: number
  commission: number
  profit: number
  reference_number: string | null
  user_id: string | null
  user_name: string | null
  notes: string | null
  created_at: string
}

export interface AuditLog {
  id: string
  tenant_id: string
  user_id: string | null
  user_name: string | null
  action: string
  table_name: string | null
  record_id: string | null
  old_data: Record<string, any> | null
  new_data: Record<string, any> | null
  created_at: string
}
