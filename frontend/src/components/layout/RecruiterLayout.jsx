import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { recruiterNav } from '../../data/recruiterNav'

const RecruiterLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const SidebarContent = () => (
    <>
      <div className='px-5 pb-5 border-b border-white/10 mb-1.5 flex items-center gap-2'>
        <span className='font-bold text-lg'>Vela</span>
        <span className='ml-auto text-[9px] font-mono text-[#8B96A8] border border-white/15 rounded-full px-1.5 py-0.5'>
          RECRUITER
        </span>
      </div>

      {recruiterNav.map((group) => (
        <div key={group.label} className='mt-4.5 px-5'>
          <div className='text-[10px] font-mono uppercase tracking-widest text-[#5E6A7D] mb-2'>
            {group.label}
          </div>
          {group.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block w-full text-sm px-2.5 py-2 rounded mb-0.5 border-l-2 transition-colors ${
                  isActive
                    ? 'bg-[#C98A3E]/[0.14] text-white border-[#C98A3E]'
                    : 'text-[#B7C0CC] border-transparent hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      ))}

      <div className='mt-auto px-5 pt-4.5 border-t border-white/10'>
        <div className='flex items-center gap-2.5'>
          <div className='w-8 h-8 rounded-full bg-[#C98A3E] text-white flex items-center justify-center font-semibold text-xs shrink-0'>
            MF
          </div>
          <div>
            <div className='text-[12.5px] font-semibold text-white'>David Kwan</div>
            <div className='text-[11px] text-[#8B96A8]'>Talent Partner, Northwind Health</div>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div className='flex min-h-screen'>

      {/* desktop sidebar — hidden on mobile */}
      <aside className='hidden md:flex w-[236px] shrink-0 bg-[#0F1A2B] text-[#EAEAE6] flex-col py-6 sticky top-0 h-screen overflow-y-auto'>
        <SidebarContent />
      </aside>

      {/* mobile topbar with hamburger — hidden on desktop */}
      <div className='md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 h-14 bg-[#0F1A2B] text-white'>
        <span className='font-bold text-base'>Vela</span>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className='flex flex-col justify-center items-center gap-[5px] w-9 h-9'
          aria-label='Toggle menu'
        >
          <span className={`block w-5 h-[2px] bg-white transition-transform ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
          <span className={`block w-5 h-[2px] bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-[2px] bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
        </button>
      </div>

      {/* mobile slide-out drawer */}
      {menuOpen && (
        <div className='md:hidden fixed inset-0 z-30 flex'>
          <div className='w-[236px] bg-[#0F1A2B] text-[#EAEAE6] flex flex-col py-6 h-full overflow-y-auto'>
            <SidebarContent />
          </div>
          <div
            className='flex-1 bg-black/40'
            onClick={() => setMenuOpen(false)}
          />
        </div>
      )}

      {/* page content */}
      <div className='flex-1 min-w-0 bg-[#EEF0EC] pt-14 md:pt-0'>
        <Outlet />
      </div>
    </div>
  )
}

export default RecruiterLayout