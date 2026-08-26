import React, { useState } from 'react'
import { useNavigate, Link } from "react-router-dom"
import toast from 'react-hot-toast'

const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm text-[#0F1A2B] placeholder-[#3C4A5E]/50 border border-[#DBDCD3] bg-[#EEF0EC] focus:outline-none focus:border-[#A6503E] mb-3"
const errorClass = "text-xs text-[#A6503E] mt-1 mb-2"

const GetStarted = () => {

const [accountType, setAccountType] = useState('')

      
  
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!accountType) {
    toast.error('Please select an option.')
      return
    }
     navigate(`/register?type=${accountType}`)
 

  }

  return (
    <div className="min-h-screen" style={{ background: "#EEF0EC" }}>
      <div className="px-8 py-3 border-b border-[#DBDCD3] text-sm text-[#3C4A5E]">
        <Link to='/' className="cursor-pointer hover:text-[#0F1A2B] transition-colors">
          Home
        </Link>
        <span className="mx-2 text-[#3C4A5E]">/</span>
        <span className="text-[#0F1A2B]">Get-Started</span>
      </div>

      <div className="flex items-center justify-center py-16 px-5">
        <div className="w-full max-w-sm p-8 rounded-2xl border border-[#DBDCD3]" style={{ background: "white" }}>
          <h1 className="text-3xl font-bold text-center text-[#0F1A2B] mb-6">
            Vela
          </h1>

          <h2 className="text-xl font-medium text-[#0F1A2B] mb-1">Create account</h2>
          <p className="text-sm text-[#3C4A5E] mb-8">Join Vela to plot the route</p>





          <form onSubmit={handleSubmit}>


             <select 
             className={inputClass}
              value={accountType}
  onChange={(e) => setAccountType(e.target.value)}
              >
      <option value=''>Get Started as a </option>
      <option value='candidate'>Candidate</option>
      <option value='employer'>Employer</option>
      
    </select>
            

          

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-sm text-white font-medium border-none cursor-pointer disabled:opacity-50 mt-3"
              style={{ background: "linear-gradient(15deg,#0F1A2B)" }}
            >
              Register
            </button>
          </form>

          
        </div>
      </div>
    </div>
  )
}

export default GetStarted