import React, { useState } from 'react'
import log2 from '../assets/log2.svg'
import { Link, useNavigate, useLocation } from "react-router-dom"

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollToSection = (id) => (e) => {
    e.preventDefault()
    setMenuOpen(false)
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/#${id}`)
    }
  }

  const navLinks = [
    { id: 'journey', label: 'How it works' },
    { id: 'whoitsfor', label: "Who it's for" },
    { id: 'features', label: 'AI engine' },
    { id: 'results', label: 'Result' },
  ]

  return (
    <nav className='w-full bg-[#EEF0EC] relative border-b border-[#DBDCD3] '>
      <div className='flex justify-between items-center px-5 h-16'>

        <div className='flex items-center gap-[2px]'>
          <img src={log2} className='h-20 w-auto' alt='vela' />
          <div className='flex flex-col leading-[1] select-none'>
            <span className='text-[20px] font-medium uppercase tracking-tighter text-[#0F1A2B]'>Vela</span>
            <span className='text-[8px] font-bold uppercase tracking-tighter text-[#5C7A6E]'>Where talent meets opportunity</span>
          </div>
        </div>

        {/* desktop links  hidden on mobile */}
        <div className='hidden md:flex items-center gap-8'>
          {navLinks.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={scrollToSection(l.id)} className='text-[#3C4A5E] hover:text-black text-sm transition-colors'>
              {l.label}
            </a>
          ))}
        </div>

        {/* desktop buttons  hidden on mobile */}
        <div className='hidden md:flex gap-3'>
          <Link to='/login' className='border rounded border-[#DBDCD3] hover:border-black py-2 px-3 text-[#0F1A2B] hover:text-black text-sm transition-colors'>
            Login
          </Link>
          <Link to='/get-started' className='text-white text-sm px-3 py-2 rounded transition-colors'
            style={{ background: 'linear-gradient(15deg,#0F1A2B)' }}>
            Get Started
          </Link>
        </div>

        {/* hamburger  visible only on mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className='md:hidden flex flex-col justify-center items-center gap-[5px] w-9 h-9'
          aria-label='Toggle menu'
        >
          <span className={`block w-6 h-[2px] bg-[#0F1A2B] transition-transform ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-6 h-[2px] bg-[#0F1A2B] transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-[2px] bg-[#0F1A2B] transition-transform ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div> 

      {/* mobile dropdown panel */}
      {menuOpen && (
        <div className='md:hidden flex flex-col gap-1 px-5 pb-5 bg-[#EEF0EC] border-t border-[#DBDCD3]'>
          {navLinks.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={scrollToSection(l.id)} className='text-[#3C4A5E] hover:text-black text-sm py-3 border-b border-[#DBDCD3]/60'>
              {l.label}
            </a>
          ))}
          <div className='flex flex-col gap-3 mt-4'>
            <Link to='/login' onClick={() => setMenuOpen(false)} className='border rounded border-[#DBDCD3] hover:border-black py-2 px-3 text-[#0F1A2B] text-sm text-center transition-colors'>
              Login
            </Link>
            <Link to='/get-started' onClick={() => setMenuOpen(false)} className='text-white text-sm px-3 py-2 rounded text-center transition-colors'
              style={{ background: 'linear-gradient(15deg,#0F1A2B)' }}>
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
export default Navbar