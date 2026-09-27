import React from 'react'
import { useNavigate } from 'react-router-dom'

const stats = [
  { label: 'Total users', value: '84,210', delta: '↑ 3.1% this month' },
  { label: 'Companies', value: '612', delta: '↑ 14 this month' },
  { label: 'Roles posted (30d)', value: '3,940' },
  { label: 'MRR', value: '$318k', delta: '↑ 4.6% MoM' },
]

const signups = [
  { role: 'Candidate', pct: 88 },
  { role: 'Recruiter', pct: 34 },
  { role: 'Company', pct: 12 },
]

const Dashboard = () => {
  const navigate = useNavigate()

  return (
    <div className='p-5'>

      <div className='flex justify-between items-center mb-5'>
        <div>
          <h1 className='text-2xl md:text-3xl font-serif font-medium text-[#0F1A2B]'>Platform dashboard</h1>
          <p className='text-sm text-[#3C4A5E]/70 mt-1'>Vela-wide activity across all accounts</p>
        </div>
        <span className='inline-flex items-center gap-1.5 text-[11px] font-mono bg-[#E4EAE6] text-[#5C7A6E] rounded-full px-2.5 py-1'>
          <span className='w-1.5 h-1.5 rounded-full bg-[#5C7A6E]' />
          All systems operational
        </span>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-px bg-[#DBDCD3] border border-[#DBDCD3] rounded-md overflow-hidden mb-5'>
        {stats.map((s) => (
          <div key={s.label} className='bg-white p-5'>
            <div className='text-[10.5px] font-mono uppercase tracking-wide text-[#3C4A5E] mb-2.5'>{s.label}</div>
            <div className='font-serif text-2xl font-semibold text-[#0F1A2B]'>{s.value}</div>
            {s.delta && <div className='text-[11.5px] text-[#5C7A6E] mt-1.5'>{s.delta}</div>}
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>

        <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
          <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Signups by role</h3>
          <div className='flex items-end gap-3.5 h-[140px]'>
            {signups.map((s) => (
              <div key={s.role} className='flex-1 flex flex-col items-center gap-2'>
                <div className='w-full bg-[#5C7A6E] rounded-t-[4px]' style={{ height: `${s.pct}%` }} />
                <span className='text-[10.5px] font-mono text-[#3C4A5E]'>{s.role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='font-serif text-base font-semibold text-[#0F1A2B]'>Needs attention</h3>
            <button onClick={() => navigate('/admin/moderation')} className='text-xs font-semibold text-[#C98A3E]'>
              View queue →
            </button>
          </div>
          <div className='flex flex-col gap-3'>
            <div className='flex justify-between items-center p-3.5 border border-[#DBDCD3] rounded-[5px]'>
              <div>
                <div className='text-sm font-semibold text-[#0F1A2B]'>14 flagged listings</div>
                <div className='text-xs text-[#3C4A5E] mt-0.5'>Pending review, oldest 6h old</div>
              </div>
              <span className='text-[11px] font-mono bg-[#F2E0DC] text-[#A6503E] rounded-full px-2.5 py-1'>High</span>
            </div>
            <div className='flex justify-between items-center p-3.5 border border-[#DBDCD3] rounded-[5px]'>
              <div>
                <div className='text-sm font-semibold text-[#0F1A2B]'>3 companies over usage limits</div>
                <div className='text-xs text-[#3C4A5E] mt-0.5'>Growth plan, action needed</div>
              </div>
              <span className='text-[11px] font-mono bg-[#F5E7D2] text-[#8A5D22] rounded-full px-2.5 py-1'>Medium</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard