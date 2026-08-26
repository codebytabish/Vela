import React, { useState } from 'react'
import { useNavigate, Link, useSearchParams } from "react-router-dom"
import toast from 'react-hot-toast'

const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm text-[#0F1A2B] placeholder-[#3C4A5E]/50 border border-[#DBDCD3] bg-[#EEF0EC] focus:outline-none focus:border-[#A6503E] mb-3"
const errorClass = "text-xs text-[#A6503E] mt-1 mb-2"

const Register = () => {
      const [searchParams] = useSearchParams()
      const navigate = useNavigate()

const [accountType] = useState(searchParams.get('type') || 'candidate') // from URL, from GetStarted

const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  companyName: '',    // only used/shown if accountType === 'employer'
  industry: '',       // only used/shown if accountType === 'employer'
})
      
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
   if (accountType === 'employer' && !formData.companyName.trim()) {
  toast.error('Enter your company name.')
  return

    }
    setIsSubmitting(true)
    try {
      // TODO: replace with real signup API call 
      // await api.post('/auth/register', formData)
      toast.success('Account created')
      navigate('/candidate')
    } catch (err) {
      toast.error("Couldn't create your account. Try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "#EEF0EC" }}>
      <div className="px-8 py-3 border-b border-[#DBDCD3] text-sm text-[#3C4A5E]">
        <Link to='/' className="cursor-pointer hover:text-[#0F1A2B] transition-colors">
          Home
        </Link>
        <span className="mx-2 text-[#3C4A5E]">/</span>
        <span className="text-[#0F1A2B]">Register</span>
      </div>

      <div className="flex items-center justify-center py-16 px-5">
        <div className="w-full max-w-sm p-8 rounded-2xl border border-[#DBDCD3]" style={{ background: "white" }}>
          <h1 className="text-3xl font-bold text-center text-[#0F1A2B] mb-6">
            Vela
          </h1>

         <h2 className="text-xl font-medium text-[#0F1A2B] mb-3">{accountType === 'employer' ? 'Set up your company' : 'Create account'}</h2>
<p className='mb-3 text-[#3C4A5E]'>{accountType === 'employer' ? 'Start hiring on Vela' : 'Join Vela to plot the route'}</p>




          <form onSubmit={handleSubmit}>
            <input
              type='text'
              placeholder='Full name'
              required
              className={inputClass}
              value={formData.name}
              onChange={set('name')}
            />

            <input
              type="email"
              placeholder="Email"
              required
              className={inputClass}
              value={formData.email}
              onChange={set('email')}
            />

            <input
              type="password"
              placeholder="Password (min 6 characters)"
              required
              minLength={6}
              className={inputClass}
              value={formData.password}
              onChange={set('password')}
            />




            {accountType === 'employer' && (
  <>
    <input
    className={inputClass}
      placeholder='Company name'
      value={formData.companyName}
      onChange={set('companyName')}
    />
    <select  className={inputClass} value={formData.industry} onChange={set('industry')}>
      <option value=''>Select industry</option>
      <option value='healthcare'>Healthcare</option>
      <option value='technology'>Technology</option>
      <option value='technology'>Finance</option>
      <option value='technology'>Law</option>
      
    </select>
  </>
)}


            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg text-sm text-white font-medium border-none cursor-pointer disabled:opacity-50 mt-3"
              style={{ background: "linear-gradient(15deg,#0F1A2B)" }}
            >
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#3C4A5E]">
            Already have an account?{' '}
            <Link to='/login' className="text-[#0F1A2B] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register