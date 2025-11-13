import './App.css'
import LoginPage from './pages/auth/LoginPage.jsx'
import AdminDashboard from './pages/dashboard/AdminDashboard.jsx'
import EmployeeDashboard from './pages/dashboard/EmployeeDashboard.jsx'
import ManagerDashboard from './pages/dashboard/ManagerDashboard.jsx'
import ProjectManagerDashboard from './pages/dashboard/ProjectManagerDashboard.jsx'
import HrManagerDashboard from './pages/dashboard/HrManagerDashboard.jsx'
import AccountingManagerDashboard from './pages/dashboard/AccountingManagerDashboard.jsx'

function App() {
  const ls = typeof localStorage !== 'undefined' ? localStorage : null
  const token = ls ? ls.getItem('accessToken') : null
  const role = ls ? ls.getItem('userRole') : null
  const expiresAtStr = ls ? ls.getItem('expiresAt') : null
  const now = Date.now()
  const isValidToken = Boolean(token && expiresAtStr && Number(expiresAtStr) > now)

  if (!isValidToken && ls) {
    // Clear stale credentials to avoid unintended redirects
    ls.removeItem('accessToken')
    ls.removeItem('refreshToken')
    ls.removeItem('tokenType')
    ls.removeItem('userRole')
    ls.removeItem('username')
    ls.removeItem('expiresAt')
  }

  // Route based on user role
  if (isValidToken && role === 'ADMIN') {
    return <AdminDashboard />
  }

  if (isValidToken && role === 'MANAGER_PROJECT') {
    return <ProjectManagerDashboard />
  }

  if (isValidToken && role === 'MANAGER_HR') {
    return <HrManagerDashboard />
  }

  if (isValidToken && role === 'MANAGER_ACCOUNTING') {
    return <AccountingManagerDashboard />
  }

  if (isValidToken && role === 'EMPLOYEE') {
    return <EmployeeDashboard />
  }

  return <LoginPage />
}

export default App
