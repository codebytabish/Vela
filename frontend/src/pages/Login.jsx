import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth, homeFor } from '../context/AuthContext'

const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm text-[#0F1A2B] placeholder-[#3C4A5E]/50 border border-[#DBDCD3] bg-[#EEF0EC] focus:outline-none focus:border-[#A6503E] mb-3"

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const u = await login(formData.email, formData.password)
      toast.success('Welcome back')
      navigate(location.state?.from?.pathname || homeFor(u), { replace: true })
    } catch (err) {
      toast.error(err.status ? err.message : "Couldn't reach the server. Is the backend running?")
    } finally {
      setIsSubmitting(false)
    }
  }

  // already logged in? skip this page
  if (user) return <Navigate to={homeFor(user)} replace />

  return (
    <div className="min-h-screen" style={{ background: "#EEF0EC" }}>
      <div className="px-8 py-3 border-b border-[#DBDCD3] text-sm text-[#3C4A5E]">
        <Link to="/" className="cursor-pointer hover:text-[#0F1A2B] transition-colors">Home</Link>
        <span className="mx-2 text-[#3C4A5E]">/</span>
        <span className="text-[#0F1A2B]">Login</span>
      </div>

      <div className="flex items-center justify-center py-16 px-5">
        <div className="w-full max-w-sm p-8 rounded-2xl border border-[#DBDCD3]" style={{ background: "white" }}>
          <h1 className="text-3xl font-bold text-center text-[#0F1A2B] mb-6">Vela</h1>
          <h2 className="text-xl font-medium text-[#0F1A2B] mb-1">Login</h2>
          <p className="text-sm text-[#3C4A5E] mb-8">Welcome back to Vela</p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={inputClass}
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={inputClass}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg text-sm text-white font-medium border-none cursor-pointer disabled:opacity-50 mt-3"
              style={{ background: "#0F1A2B" }}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#3C4A5E]">
            Don't have an account?{' '}
            <Link to="/get-started" className="text-[#0F1A2B] hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login