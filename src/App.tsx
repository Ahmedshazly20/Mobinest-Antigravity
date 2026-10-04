import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { ROUTES } from '@/constants/routes'

// Placeholder / lazy loaded page shells for initial compilation
import LoginPage from '@/pages/auth/LoginPage'
import PinPage from '@/pages/auth/PinPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import ProductsPage from '@/pages/inventory/ProductsPage'
import InvoicesPage from '@/pages/sales/InvoicesPage'
import NewInvoicePage from '@/pages/sales/NewInvoicePage'
import CustomersPage from '@/pages/customers/CustomersPage'
import MaintenancePage from '@/pages/maintenance/MaintenancePage'
import TreasuryPage from '@/pages/treasury/TreasuryPage'
import ExpensesPage from '@/pages/expenses/ExpensesPage'
import FawryPage from '@/pages/fawry/FawryPage'
import ReportsPage from '@/pages/reports/ReportsPage'
import EmployeesPage from '@/pages/employees/EmployeesPage'
import SettingsPage from '@/pages/settings/SettingsPage'
import AppLayout from '@/components/layout/AppLayout'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isOwnerLoggedIn = useAuthStore((state) => state.isOwnerLoggedIn)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isOwnerLoggedIn) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.PIN} replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      {/* Public / Auth Routes */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.PIN} element={<PinPage />} />

      {/* Protected App Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path={ROUTES.INVENTORY} element={<ProductsPage />} />
        <Route path={ROUTES.SALES} element={<InvoicesPage />} />
        <Route path={ROUTES.NEW_INVOICE} element={<NewInvoicePage />} />
        <Route path={ROUTES.CUSTOMERS} element={<CustomersPage />} />
        <Route path={ROUTES.MAINTENANCE} element={<MaintenancePage />} />
        <Route path={ROUTES.TREASURY} element={<TreasuryPage />} />
        <Route path={ROUTES.EXPENSES} element={<ExpensesPage />} />
        <Route path={ROUTES.FAWRY} element={<FawryPage />} />
        <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
        <Route path={ROUTES.EMPLOYEES} element={<EmployeesPage />} />
        <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
