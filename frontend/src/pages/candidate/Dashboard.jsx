import React from 'react'
import { Link } from 'react-router-dom'

const stats = [
  { label: 'Profile match avg', value: '84%', delta: '↑ 6 pts this month' },
  { label: 'Active applications', value: '7' },
  { label: 'Profile views', value: '142', delta: '↑ 18 this week' },
  { label: 'Interviews booked', value: '2' },
]

const recommendedRoles = [
  { title: 'Senior Product Designer', meta: 'Northwind Health · Remote · $145–170k', match: 91, tone: 'harbor' },
  { title: 'Design Systems Lead', meta: 'Ridgeline Co. · Hybrid · $150–180k', match: 88, tone: 'harbor' },
  { title: 'Product Designer II', meta: 'Fable Systems · Remote · $120–140k', match: 76, tone: 'brass' },
]

const activity = [
  { before: 'Application to ', bold: 'Northwind Health', after: ' moved to Interviewing', time: '2 hours ago' },
  { before: 'AI improvement applied to your ', bold: 'Experience', after: ' section', time: 'Yesterday' },
  { before: 'New role match: ', bold: 'Design Systems Lead', after: ' at Ridgeline Co.', time: '2 days ago' },
]


const completeness = [
  { label: 'Experience & education', done: true },
  { label: 'Skills graph', done: true },
  { label: 'Resume uploaded', done: true },
  { label: 'Portfolio projects', done: false },
  { label: 'References', done: false },
]

const  upcoming =[
  {label:'Interview — Northwind Health',time:'Tue Aug 4 · 2:00 PM'},
  {label:'Follow-up due — Fable Systems',time:'Thu Aug 6'}
]
const Dashboard = () => {
  return (
    <div className='p-5'>

      <div className='flex justify-between items-center mb-5 lg:sticky border-[#DBDCD3] border-b pb-5'>
        <div>
          <h1 className='text-2xl  font-medium text-[#0F1A2B]'>Good morning, Marisol</h1>
          <p className='text-sm text-[#3C4A5E]/70 mt-1'>Here's where your search stands today</p>
        </div>
        <Link to='/find-roles' className="cursor-pointer border rounded py-2 px-3 text-white bg-[#C98A3E] hover:bg-[#B67B33] transition-colors">
          Find Roles
        </Link>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-px bg-[#DBDCD3] border  border-[#DBDCD3] rounded-md overflow-hidden mb-5'>
        {stats.map((s) => (
          <div key={s.label} className='bg-white p-5'>
            <div className='text-[10.5px] font-mono uppercase tracking-wide text-[#3C4A5E] mb-2.5'>
              {s.label}
            </div>
            <div className='font-serif text-2xl font-semibold text-[#0F1A2B]'>{s.value}</div>
            {s.delta && (
              <div className='text-[11.5px] text-[#5C7A6E] mt-1.5'>{s.delta}</div>
            )}
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5'>

        <div className='flex flex-col gap-5'>

          <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='font-serif text-base font-semibold text-[#0F1A2B]'>Recommended for you</h3>
              <a href='#' className='text-xs font-semibold text-[#C98A3E]'>View all →</a>
            </div>
            {recommendedRoles.map((r, i) => (
              <div key={r.title} className={`flex justify-between items-center gap-4 py-4 ${i !== recommendedRoles.length - 1 ? 'border-b border-[#DBDCD3]' : ''}`}>
                <div>
                  <div className='font-semibold text-sm text-[#0F1A2B]'>{r.title}</div>
                  <div className='text-xs text-[#3C4A5E] mt-1'>{r.meta}</div>
                </div>
                <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full shrink-0 ${
                  r.tone === 'harbor' ? 'bg-[#E4EAE6] text-[#5C7A6E]' : 'bg-[#F5E7D2] text-[#8A5D22]'
                }`}>
                  {r.match}% match
                </span>
              </div>
            ))}
          </div>



<div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
   <div className='flex justify-between items-center mb-4'>
                  <h3 className='font-serif text-base font-semibold text-[#0F1A2B]'>Recent Activity</h3>

   </div>
    {activity.map((a, i) => (

              <div key={a.text} className={`flex justify-between items-center gap-4 py-3 ${i !== activity.length - 1 ? 'border-b border-[#DBDCD3]' : ''}`}>
                <div className='gap-3 flex py-2'>
                    <div className='w-2 h-2 rounded-full bg-[#C98A3E] mt-1.5 shrink-0' />
                    <div>
                   <p className='text-[12.5px] text-[#0F1A2B] leading-relaxed'>
        {a.before}<strong className='font-semibold'>{a.bold}</strong>{a.after}
      </p>
                  <div className='text-[11px]  font-mono text-[#3C4A5E] mt-1'>{a.time}</div>
                </div>
               
              </div>
              </div>
            ))}
          </div>
             

        </div>
     {/* second column */}
        <div>
          <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
            <div className='flex justify-between items-center mb-4'>
                  <h3 className='font-serif text-base font-semibold text-[#0F1A2B]'>Profile Strength</h3>

   </div>
    <div className='flex flex-col gap-2 mt-4'>
       <svg width="80" height="80">
    {/* background track — full faint circle */}
    <circle cx="40" cy="40" r="34" fill="none" stroke="#DBDCD3" strokeWidth="7" />
    {/* progress ring — only shows 82% of the circumference */}
    <circle
      cx="40" cy="40" r="34" fill="none" stroke="#5C7A6E" strokeWidth="7"
      strokeDasharray="214" strokeDashoffset="38" strokeLinecap="round"
      transform="rotate(-90 40 40)"
    />
  </svg>
        {completeness.map((c) => (
          <div key={c.label} className='flex items-center gap-2 text-[12.5px]'>
            <span className={`w-3.5 h-3.5 rounded-full border-[1.5px] shrink-0 ${c.done ? 'bg-[#5C7A6E] border-[#5C7A6E]' : 'border-[#DBDCD3]'}`} />
            <span className={c.done ? 'text-[#0F1A2B]' : 'text-[#3C4A5E]'}>{c.label}</span>
          </div>
        ))}
      </div>
      
          </div>

          <div className='bg-white border border-[#DBDCD3] rounded-md p-6 mt-5'>
  <div className='flex justify-between items-center mb-4'>
                  <h3 className='font-serif text-base font-semibold text-[#0F1A2B]'>Upcoming</h3>
   </div>
    {upcoming.map((u, i) => (

              <div key={u.label} className={`flex justify-between items-center gap-4 py-3 ${i !== upcoming.length - 1 ? 'border-b border-[#DBDCD3]' : ''}`}>
                <div className='gap-3 flex py-2'>
                    <div className='w-2 h-2 rounded-full bg-[#C98A3E] mt-1.5 shrink-0' />
                    <div>
                       <div className='font-semibold text-sm text-[#0F1A2B]'>{u.label}</div>
                  <div className='text-[11px]  font-mono text-[#3C4A5E] mt-1'>{u.time}</div>
                </div>
               
              </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      


    </div>
  )
}

export default Dashboard