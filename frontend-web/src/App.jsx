import './App.css'
import { AuthProvider } from './features/auth/context/AuthContext'
import AppRouter from './routes'

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App
