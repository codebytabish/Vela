import React from 'react'
import { useNavigate } from 'react-router-dom'

const stats = [
  { label: 'Open roles', value: '4' },
  { label: 'Active candidates', value: '312', delta: '↑ 24 this week' },
  { label: 'Interviews this week', value: '9' },
  { label: 'Avg. time to shortlist', value: '2.1d', delta: '↓ 1.4d vs last month' },
]

const topCandidates = [
  { id: 1, name: 'Marisol Ferreira', role: 'Senior Product Designer', appliedAgo: '2d ago', match: 91 },
  { id: 2, name: 'Priya Anand', role: 'Senior Product Designer', appliedAgo: '1d ago', match: 88 },
  { id: 3, name: 'Tom Whitfield', role: 'Design Systems Lead', appliedAgo: '3d ago', match: 79 },
]

const upcomingInterviews = [
  { id: 1, name: 'Marisol Ferreira', role: 'Senior Product Designer', time: 'Tue, 2:00 PM' },
  { id: 2, name: 'Priya Anand', role: 'Senior Product Designer', time: 'Wed, 10:30 AM' },
  { id: 3, name: 'Sana Okafor', role: 'Design Systems Lead', time: 'Thu, 1:00 PM' },
]

const matchColor = (match) => {
  if (match >= 85) return 'bg-[#E4EAE6] text-[#5C7A6E]'
  if (match >= 70) return 'bg-[#F5E7D2] text-[#8A5D22]'
  return 'bg-[#F2E0DC] text-[#A6503E]'
}

const RecruiterDashboard = () => {
  const navigate = useNavigate()

  return (
    <div className='p-5'>

      <div className='flex justify-between items-center sticky mb-5 pb-5 border-b border-[#DBDCD3]'>
        <div>
          <h1 className='text-2xl md:text-3xl font-medium text-[#0F1A2B]'>Good morning, David</h1>
          <p className='text-sm text-[#3C4A5E]/70 mt-1'>4 open roles are currently plotting matches</p>
        </div>
        <button
          onClick={() => navigate('/recruiter/create')}
          className='bg-[#C98A3E] hover:bg-[#B67B33] rounded py-2 px-3.5 text-sm text-white font-medium transition-colors'
        >
          + Post a role
        </button>
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
          <div className='flex justify-between items-center mb-4'>
            <h3 className='font-serif text-base font-semibold text-[#0F1A2B]'>Top-ranked candidates</h3>
            <button onClick={() => navigate('/recruiter/ranking')} className='text-xs font-semibold text-[#C98A3E]'>
              View all →
            </button>
          </div>
          <div className='divide-y divide-[#DBDCD3]'>
            {topCandidates.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate('/recruiter/profile')}
                className='flex justify-between items-center gap-4 py-3.5 cursor-pointer hover:bg-[#EEF0EC] -mx-2 px-2 rounded transition-colors'
              >
                <div>
                  <div className='font-semibold text-sm text-[#0F1A2B]'>{c.name}</div>
                  <div className='text-xs text-[#3C4A5E] mt-1'>{c.role} · applied {c.appliedAgo}</div>
                </div>
                <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full shrink-0 ${matchColor(c.match)}`}>
                  {c.match}% match
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
          <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Upcoming interviews</h3>
          <div className='divide-y divide-[#DBDCD3]'>
            {upcomingInterviews.map((i) => (
              <div key={i.id} className='flex justify-between items-center gap-4 py-3.5'>
                <div>
                  <div className='font-semibold text-sm text-[#0F1A2B]'>{i.name}</div>
                  <div className='text-xs text-[#3C4A5E] mt-1'>{i.role}</div>
                </div>
                <span className='text-[11px] font-mono border border-[#DBDCD3] rounded-full px-2.5 py-1 text-[#3C4A5E] shrink-0'>
                  {i.time}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default RecruiterDashboard