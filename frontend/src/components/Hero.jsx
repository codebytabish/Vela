import React from 'react'
import { Link } from "react-router-dom"

const Hero = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-10 bg-[#EEF0EC] px-5 md:px-10 py-14 lg:py-20 items-center'>

      <div>
        <p className="text-xs font-bold text-[#5C7A6E]/50">
          — CAREER NAVIGATION, PLOTTED BY AI
        </p>

        <h1 className='text-3xl md:text-5xl lg:text-6xl pt-3 text-[#0F1A2B] font-bold leading-[1.05]'>
          Chart the route
        </h1>
        <h1 className='text-3xl md:text-5xl lg:text-6xl text-[#0F1A2B] font-bold leading-[1.05]'>
          from resume to
        </h1>
        <h1 className='text-3xl md:text-5xl lg:text-6xl font-bold text-[#A6503E]/80 leading-[1.05]'>
          the right role.
        </h1>

        <p className='pt-5 text-base text-[#3C4A5E] max-w-[460px] leading-relaxed'>
          Vela reads your resume the way a hiring system does, plots it against roles
          worth pursuing, and scores the fit — so candidates apply with confidence and
          recruiters shortlist in minutes, not weeks.
        </p>

        <div className='flex flex-wrap gap-3 mt-10'>
          <Link
            to="/get-started"
            className="bg-[#0F1A2B] text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-[#1C2C45] transition-colors"
          >
            Plot your first match
          </Link>
          <Link
            to="/recruiter"
            className="text-[#0F1A2B] border border-[#DBDCD3] hover:border-black text-sm font-semibold px-5 py-2.5 rounded-md transition-colors"
          >
            See it for recruiters
          </Link>
        </div>

        <div className="flex flex-wrap gap-7 mt-11 pt-6 border-t border-[#DBDCD3]">
          <div>
            <div className="font-serif text-2xl font-semibold text-[#0F1A2B]">2.1M</div>
            <div className="text-[11.5px] text-[#3C4A5E] mt-0.5">Resumes charted</div>
          </div>
          <div>
            <div className="font-serif text-2xl font-semibold text-[#0F1A2B]">94%</div>
            <div className="text-[11.5px] text-[#3C4A5E] mt-0.5">Parsing accuracy</div>
          </div>
          <div>
            <div className="font-serif text-2xl font-semibold text-[#0F1A2B]">6.4s</div>
            <div className="text-[11.5px] text-[#3C4A5E] mt-0.5">Avg. match time</div>
          </div>
        </div>
      </div>

      {/* route panel with animated graph */}
      <div className='bg-[#0F1A2B] rounded-2xl p-8 relative overflow-hidden min-h-[380px]'>
        <div className='flex justify-between items-center relative z-10'>
          <span className='text-[11px] font-mono uppercase tracking-widest text-[#8B96A8]'>Live route</span>
          <span className='inline-flex items-center gap-1.5 text-[11px] font-mono bg-[#E4EAE6] text-[#5C7A6E] rounded-full px-2.5 py-1'>
            <span className='w-1.5 h-1.5 rounded-full bg-[#5C7A6E]' />
            plotting
          </span>
        </div>

        <svg className='w-full h-[220px] mt-4 relative z-10' viewBox="0 0 460 220" fill="none">
          <path
            d="M40 40 C 160 40, 180 180, 420 180"
            stroke="#C98A3E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="6 7"
            style={{ animation: 'dash 3.2s linear infinite' }}
          />
          <circle cx="40" cy="40" r="6" fill="#5C7A6E" />
          <circle className="pulse-dot" cx="40" cy="40" r="6" fill="#5C7A6E" opacity="0.5" />
          <circle cx="420" cy="180" r="6" fill="#C98A3E" />
          <circle className="pulse-dot" cx="420" cy="180" r="6" fill="#C98A3E" opacity="0.5" />
          <circle cx="230" cy="94" r="4" fill="#fff" opacity="0.5" />
          <text x="52" y="36" fill="#DCE1E8" fontFamily="JetBrains Mono" fontSize="10">Candidate</text>
          <text x="330" y="200" fill="#DCE1E8" fontFamily="JetBrains Mono" fontSize="10">Role</text>
        </svg>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 relative z-10'>
          <div className='bg-white/[0.06] border border-white/[0.14] rounded-lg p-3.5'>
            <div className='text-[13.5px] font-semibold text-white'>M. Ferreira — Product Designer</div>
            <div className='text-[11.5px] text-[#9AA5B4] mt-1'>5 yrs · Figma · Design systems</div>
          </div>
          <div className='bg-white/[0.06] border border-white/[0.14] rounded-lg p-3.5'>
            <div className='text-[13.5px] font-semibold text-white'>Sr. Product Designer</div>
            <div className='text-[11.5px] text-[#9AA5B4] mt-1'>Northwind Health · Remote</div>
          </div>
        </div>

        <div className='flex justify-between items-center mt-6 pt-5 border-t border-dashed border-white/[0.18] relative z-10'>
          <div>
            <div className='font-serif text-4xl font-semibold text-[#C98A3E]'>91</div>
            <div className='text-[11px] font-mono text-[#8B96A8] tracking-wide'>MATCH SCORE / 100</div>
          </div>
          <span className='text-[11px] font-mono bg-white/[0.06] border border-white/[0.16] text-[#DCE1E8] rounded-full px-2.5 py-1'>
            92% · SKILLS
          </span>
        </div>
      </div>

    </div>
  )
}

export default Hero