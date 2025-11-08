import './App.css'
import LoginPage from './pages/auth/LoginPage.jsx'
import AdminDashboard from './pages/dashboard/AdminDashboard.jsx'

function App() {
  const ls = typeof localStorage !== 'undefined' ? localStorage : null
  const token = ls ? ls.getItem('accessToken') : null
  const role = ls ? ls.getItem('userRole') : null
  const expiresAtStr = ls ? ls.getItem('expiresAt') : null
  const now = Date.now()
  const isValid = Boolean(token && role === 'ADMIN' && expiresAtStr && Number(expiresAtStr) > now)

  if (!isValid && ls) {
    // Clear stale credentials to avoid unintended redirects
    ls.removeItem('accessToken')
    ls.removeItem('refreshToken')
    ls.removeItem('tokenType')
    ls.removeItem('userRole')
    ls.removeItem('username')
    ls.removeItem('expiresAt')
  }

  if (isValid) return <AdminDashboard />

  return <LoginPage />
}

export default App
