import React, { useState } from 'react'

const weeklyApplicants = [
  { week: 'W1', count: 60 },
  { week: 'W2', count: 82 },
  { week: 'W3', count: 45 },
  { week: 'W4', count: 95 },
  { week: 'W5', count: 70 },
]

const funnelStages = [
  { label: 'Applied', count: 312, percent: 100 },
  { label: 'Screened', count: 181, percent: 58 },
  { label: 'Interviewing', count: 59, percent: 19 },
  { label: 'Offer', count: 14, percent: 4 },
]

const roleStats = [
  { role: 'Senior Product Designer', applicants: 87, avgMatch: 78, timeToShortlist: '1.8d' },
  { role: 'Design Systems Lead', applicants: 54, avgMatch: 74, timeToShortlist: '2.3d' },
  { role: 'Product Designer II', applicants: 129, avgMatch: 69, timeToShortlist: '2.0d' },
]

const Analytics = () => {
  const maxCount = Math.max(...weeklyApplicants.map((w) => w.count))

  return (
    <div className='p-5'>

      <div className='mb-5 sticky top-0 z-10 pb-5 border-b border-[#DBDCD3] bg-[#EEF0EC]'>
        <h1 className='text-2xl md:text-3xl font-serif font-medium text-[#0F1A2B]'>Analytics</h1>
        <p className='text-sm text-[#3C4A5E]/70 mt-1'>Hiring performance across your open roles</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5'>

        {/* bar chart */}
        <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
          <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Applicants by week</h3>
          <div className='flex items-end gap-3.5 h-[160px]'>
            {weeklyApplicants.map((w) => (
              <div key={w.week} className='flex-1 flex flex-col items-center gap-2'>
                <div
                  className='w-full bg-[#5C7A6E] rounded-t-[4px]'
                  style={{ height: `${(w.count / maxCount) * 100}%` }}
                />
                <span className='text-[10.5px] font-mono text-[#3C4A5E]'>{w.week}</span>
              </div>
            ))}
          </div>
        </div>

        {/* funnel */}
        <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
          <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Hiring funnel</h3>
          <div className='flex flex-col gap-3'>
            {funnelStages.map((stage) => (
              <div key={stage.label} className='flex items-center gap-3.5'>
                <span className='text-xs text-[#3C4A5E] w-[100px] shrink-0'>{stage.label}</span>
                <div className='flex-1 h-[22px] bg-[#EEF0EC] border border-[#DBDCD3] rounded overflow-hidden'>
                  <div
                    className='h-full bg-[#C98A3E] flex items-center pl-2.5'
                    style={{ width: `${stage.percent}%` }}
                  >
                    <span className='text-[11px] font-mono text-white'>{stage.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* per-role table */}
      <div className='overflow-x-auto border border-[#DBDCD3] rounded-lg'>
        <table className='w-full min-w-[560px] divide-y divide-[#DBDCD3] text-sm'>
          <thead className='bg-white'>
            <tr className='text-[#3C4A5E] text-left'>
              <th className='px-4 py-3 font-mono text-[10.5px] uppercase'>Role</th>
              <th className='px-4 py-3 font-mono text-[10.5px] uppercase'>Applicants</th>
              <th className='px-4 py-3 font-mono text-[10.5px] uppercase'>Avg. match</th>
              <th className='px-4 py-3 font-mono text-[10.5px] uppercase'>Time to shortlist</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-[#DBDCD3] bg-white'>
            {roleStats.map((r) => (
              <tr key={r.role} className='hover:bg-[#EEF0EC] transition-colors'>
                <td className='px-4 py-3 font-semibold text-[#0F1A2B]'>{r.role}</td>
                <td className='px-4 py-3'>{r.applicants}</td>
                <td className='px-4 py-3 font-mono'>{r.avgMatch}%</td>
                <td className='px-4 py-3 font-mono'>{r.timeToShortlist}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Analytics