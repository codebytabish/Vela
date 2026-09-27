import React from 'react'

const mau = [
  { month: 'Mar', pct: 52 },
  { month: 'Apr', pct: 61 },
  { month: 'May', pct: 70 },
  { month: 'Jun', pct: 78 },
  { month: 'Jul', pct: 95 },
]

const revenueByPlan = [
  { plan: 'Starter', pct: 20 },
  { plan: 'Growth', pct: 64 },
  { plan: 'Enterprise', pct: 88 },
]

const metrics = [
  { label: 'New signups', thisMonth: '6,240', lastMonth: '5,880', change: '↑ 6.1%', good: true },
  { label: 'Resumes parsed', thisMonth: '41,020', lastMonth: '37,600', change: '↑ 9.1%', good: true },
  { label: 'Jobs published', thisMonth: '3,940', lastMonth: '3,710', change: '↑ 6.2%', good: true },
  { label: 'Churned accounts', thisMonth: '18', lastMonth: '22', change: '↓ 18%', good: true },
]

const Analytics = () => {
  return (
    <div className='p-5'>

      <div className='mb-5'>
        <h1 className='text-2xl md:text-3xl font-serif font-medium text-[#0F1A2B]'>Platform analytics</h1>
        <p className='text-sm text-[#3C4A5E]/70 mt-1'>Usage and growth across Vela</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5'>

        <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
          <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Monthly active users</h3>
          <div className='flex items-end gap-3.5 h-[140px]'>
            {mau.map((m) => (
              <div key={m.month} className='flex-1 flex flex-col items-center gap-2'>
                <div className='w-full bg-[#5C7A6E] rounded-t-[4px]' style={{ height: `${m.pct}%` }} />
                <span className='text-[10.5px] font-mono text-[#3C4A5E]'>{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
          <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Revenue by plan</h3>
          <div className='flex items-end gap-3.5 h-[140px]'>
            {revenueByPlan.map((r) => (
              <div key={r.plan} className='flex-1 flex flex-col items-center gap-2'>
                <div className='w-full bg-[#C98A3E] rounded-t-[4px]' style={{ height: `${r.pct}%` }} />
                <span className='text-[10.5px] font-mono text-[#3C4A5E]'>{r.plan}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className='hidden sm:block overflow-x-auto border border-[#DBDCD3] rounded-lg'>
        <table className='w-full min-w-[520px] divide-y divide-[#DBDCD3] text-sm'>
          <thead className='bg-white'>
            <tr className='text-[#3C4A5E] text-left'>
              <th className='px-4 py-3 font-mono text-[10.5px] uppercase'>Metric</th>
              <th className='px-4 py-3 font-mono text-[10.5px] uppercase'>This month</th>
              <th className='px-4 py-3 font-mono text-[10.5px] uppercase'>Last month</th>
              <th className='px-4 py-3 font-mono text-[10.5px] uppercase'>Change</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-[#DBDCD3] bg-white'>
            {metrics.map((m) => (
              <tr key={m.label} className='hover:bg-[#EEF0EC] transition-colors'>
                <td className='px-4 py-3 font-semibold text-[#0F1A2B]'>{m.label}</td>
                <td className='px-4 py-3 font-mono'>{m.thisMonth}</td>
                <td className='px-4 py-3 font-mono'>{m.lastMonth}</td>
                <td className='px-4 py-3'>
                  <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full ${
                    m.good ? 'bg-[#E4EAE6] text-[#5C7A6E]' : 'bg-[#F2E0DC] text-[#A6503E]'
                  }`}>
                    {m.change}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobile cards */}
      <div className='sm:hidden flex flex-col gap-3'>
        {metrics.map((m) => (
          <div key={m.label} className='bg-white border border-[#DBDCD3] rounded-md p-4'>
            <div className='flex justify-between items-start mb-1'>
              <span className='font-semibold text-sm text-[#0F1A2B]'>{m.label}</span>
              <span className='text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#E4EAE6] text-[#5C7A6E]'>
                {m.change}
              </span>
            </div>
            <div className='text-xs text-[#3C4A5E]'>{m.thisMonth} this month · {m.lastMonth} last month</div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Analytics