import { useState } from 'react'
import React  from 'react'
import { Link ,useNavigate} from 'react-router-dom'
const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm text-[#0F1A2B] placeholder-[#3C4A5E]/50 border border-[#DBDCD3] bg-[#EEF0EC] focus:outline-none focus:border-[#A6503E] mb-3"


 
const Login = () => {
    const navigate = useNavigate()

     const handleLogin = async (e) => {
        e.preventDefault()
        navigate('/register')

  }


  return (
    <div  className="min-h-screen" style={{ background: "#EEF0EC" }}>
        <div className="px-8 py-3 border-b border-[#DBDCD3] text-sm text-[#3C4A5E]">
                <Link to='/' className="cursor-pointer hover:text-[#0F1A2B] transition-colors">
                  Home
                </Link>
                <span className="mx-2 text-[#3C4A5E]">/</span>
                <span className="text-[#0F1A2B]">Login</span>
              </div>


              <div className="flex items-center justify-center py-16 px-5">

        <div className="w-full max-w-sm p-8 rounded-2xl border border-[#DBDCD3]" style={{ background: "white" }}>
        <h1 className="text-3xl font-bold text-center text-[#0F1A2B] mb-6">
            Vela
          </h1>

          <h2 className="text-xl font-medium text-[#0F1A2B] mb-1">Login</h2>
          <p className="text-sm text-[#3C4A5E] mb-8">Join Vela to plot the route</p>




          


            <form onSubmit={handleLogin}>
                <input 
                type='email'
                placeholder='Email'
                className={inputClass}
                required
                />


                 <input 
                type='password'
                placeholder='password'
                className={inputClass}
                required
                />

                <button 
                type='submit'
                className="w-full py-2.5 rounded-lg text-sm text-white font-medium border-none cursor-pointer disabled:opacity-50 mt-3"
                                  style={{ background: "linear-gradient(15deg,#0F1A2B)" }}

                >
                    Login
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-[#3C4A5E]">
            Don't have an account?{' '}
            <Link to='/get-started' className="text-[#0F1A2B] hover:underline">
              Create Account
            </Link>
          </p>
            </div>
        </div>
        
    </div>
  )
}

export default Login