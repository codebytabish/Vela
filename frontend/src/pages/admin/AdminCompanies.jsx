import React, { useState } from 'react'

const planStyle = {
  Starter: 'bg-[#EDEDE8] text-[#3C4A5E]',
  Growth: 'bg-[#F5E7D2] text-[#8A5D22]',
  Enterprise: 'bg-[#E4EAE6] text-[#5C7A6E]',
}

const statusStyle = {
  Active: '#5C7A6E',
  'Past due': '#A6503E',
}

const Companies = () => {
  const [companies] = useState([
    { id: 1, name: 'Northwind Health', plan: 'Growth', recruiters: 6, openRoles: 14, mrr: '$499', status: 'Active' },
    { id: 2, name: 'Ridgeline Co.', plan: 'Growth', recruiters: 4, openRoles: 9, mrr: '$499', status: 'Active' },
    { id: 3, name: 'Fable Systems', plan: 'Starter', recruiters: 2, openRoles: 3, mrr: '$0', status: 'Active' },
    { id: 4, name: 'Beacon Analytics', plan: 'Enterprise', recruiters: 18, openRoles: 41, mrr: '$2,400', status: 'Active' },
    { id: 5, name: 'Loom & Co.', plan: 'Starter', recruiters: 1, openRoles: 1, mrr: '$0', status: 'Past due' },
  ])

  return (
    <div className='p-5'>

      <div className='flex justify-between items-center mb-5'>
        <div>
          <h1 className='text-2xl md:text-3xl font-serif font-medium text-[#0F1A2B]'>Company management</h1>
          <p className='text-sm text-[#3C4A5E]/70 mt-1'>612 organizations</p>
        </div>
        <button className='border border-[#DBDCD3] hover:border-[#0F1A2B] rounded py-2 px-3.5 text-sm text-[#0F1A2B] transition-colors'>
          Export CSV
        </button>
      </div>

      <div className='hidden sm:block overflow-x-auto border border-[#DBDCD3] rounded-lg'>
        <table className='w-full min-w-[700px] divide-y divide-[#DBDCD3] text-sm'>
          <thead className='bg-white'>
            <tr className='text-[#3C4A5E] text-left'>
              <th className='px-4 py-3 font-mono text-[10.5px] uppercase'>Company</th>
              <th className='px-4 py-3 font-mono text-[10.5px] uppercase'>Plan</th>
              <th className='px-4 py-3 font-mono text-[10.5px] uppercase'>Recruiters</th>
              <th className='px-4 py-3 font-mono text-[10.5px] uppercase'>Open roles</th>
              <th className='px-4 py-3 font-mono text-[10.5px] uppercase'>MRR</th>
              <th className='px-4 py-3 font-mono text-[10.5px] uppercase'>Status</th>
              <th className='px-4 py-3'></th>
            </tr>
          </thead>
          <tbody className='divide-y divide-[#DBDCD3] bg-white'>
            {companies.map((c) => (
              <tr key={c.id} className='hover:bg-[#EEF0EC] transition-colors'>
                <td className='px-4 py-3 font-semibold text-[#0F1A2B]'>{c.name}</td>
                <td className='px-4 py-3'>
                  <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full ${planStyle[c.plan]}`}>
                    {c.plan}
                  </span>
                </td>
                <td className='px-4 py-3'>{c.recruiters}</td>
                <td className='px-4 py-3'>{c.openRoles}</td>
                <td className='px-4 py-3 font-mono'>{c.mrr}</td>
                <td className='px-4 py-3'>
                  <span className='inline-flex items-center gap-1.5 text-xs text-[#3C4A5E]'>
                    <span className='w-1.5 h-1.5 rounded-full' style={{ background: statusStyle[c.status] }} />
                    {c.status}
                  </span>
                </td>
                <td className='px-4 py-3'>
                  <button className='text-xs font-semibold text-[#C98A3E] hover:text-[#B67B33]'>Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobile cards */}
      <div className='sm:hidden flex flex-col gap-3'>
        {companies.map((c) => (
          <div key={c.id} className='bg-white border border-[#DBDCD3] rounded-md p-4'>
            <div className='flex justify-between items-start mb-2'>
              <span className='font-semibold text-sm text-[#0F1A2B]'>{c.name}</span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${planStyle[c.plan]}`}>
                {c.plan}
              </span>
            </div>
            <div className='text-xs text-[#3C4A5E]'>{c.recruiters} recruiters · {c.openRoles} open roles</div>
            <div className='text-xs text-[#3C4A5E] flex items-center gap-1.5 mt-1'>
              <span className='w-1.5 h-1.5 rounded-full' style={{ background: statusStyle[c.status] }} />
              {c.status} · {c.mrr} MRR
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Companies