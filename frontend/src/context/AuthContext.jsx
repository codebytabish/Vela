import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

export const homeFor = (user) => (user.accountType === 'employer' ? '/recruiter' : '/candidate')

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // restore the session on page load
  useEffect(() => {
    api('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  // api.js fires this when a refresh fails
  useEffect(() => {
    const onLogout = () => setUser(null)
    window.addEventListener('auth:logout', onLogout)
    return () => window.removeEventListener('auth:logout', onLogout)
  }, [])

  const login = async (email, password) => {
    const d = await api('/auth/login', { method: 'POST', body: { email, password } })
    setUser(d.user)
    return d.user
  }

  const register = async (payload) => {
    const d = await api('/auth/register', { method: 'POST', body: payload })
    setUser(d.user)
    return d.user
  }

 const logout = async () => {
  try {
    await api('/auth/logout', { method: 'POST' })
  } catch (e) {
    console.error(e)
  } finally {
    localStorage.removeItem('token') // use the exact key api.js uses
    setUser(null)
  }
}
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)