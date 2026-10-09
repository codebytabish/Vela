import { Navigate, Outlet } from 'react-router-dom'
import { useAuth, homeFor } from '../context/AuthContext'

export default function ProtectedRoute({ role }) {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to='/login' replace />

  if (role && user.accountType !== role) {
    const known = ['candidate', 'employer'].includes(user.accountType)
    return <Navigate to={known ? homeFor(user) : '/'} replace />
  }

  return <Outlet />
}