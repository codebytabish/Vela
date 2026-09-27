import React, { useState } from 'react'

const roleBadgeStyle = {
  Admin: 'bg-[#F2E0DC] text-[#A6503E]',
  Recruiter: 'bg-[#E4EAE6] text-[#5C7A6E]',
  Viewer: 'bg-[#EDEDE8] text-[#3C4A5E]',
}

const statusDotColor = {
  Active: '#5C7A6E',
  Pending: '#C98A3E',
  Suspended: '#A6503E',
}

const ManageRecruiters = () => {
  const [recruiters] = useState([
    { id: 1, name: 'David Kwan', openRoles: 4, role: 'Admin', status: 'Active' },
    { id: 2, name: 'Aisha Bello', openRoles: 3, role: 'Recruiter', status: 'Active' },
    { id: 3, name: 'Marcus Feld', openRoles: 2, role: 'Recruiter', status: 'Active' },
    { id: 4, name: 'Jonah Lee', openRoles: 1, role: 'Viewer', status: 'Active' },
    { id: 5, name: 'pending@northwindhealth.com', openRoles: 0, role: 'Recruiter', status: 'Pending' },
  ])

  return (
    <div className='p-5'>

      <div className='flex justify-between items-center mb-5'>
        <div>
          <h1 className='text-2xl md:text-3xl font-serif font-medium text-[#0F1A2B]'>Manage recruiters</h1>
          <p className='text-sm text-[#3C4A5E]/70 mt-1'>
            {recruiters.filter((r) => r.status === 'Active').length} active · {recruiters.filter((r) => r.status === 'Pending').length} pending invite
          </p>
        </div>
        <button className='bg-[#C98A3E] hover:bg-[#B67B33] rounded py-2 px-3.5 text-sm text-white font-medium transition-colors'>
          + Invite recruiter
        </button>
      </div>

      {/* desktop table */}
      <div className='hidden sm:block overflow-x-auto border border-[#DBDCD3] rounded-lg'>
        <table className='w-full min-w-[640px] divide-y divide-[#DBDCD3] text-sm'>
          <thead className='bg-white'>
            <tr className='text-[#3C4A5E] text-left'>
              <th className='px-4 py-3 font-mono text-[10.5px] uppercase'>Recruiter</th>
              <th className='px-4 py-3 font-mono text-[10.5px] uppercase'>Open roles</th>
              <th className='px-4 py-3 font-mono text-[10.5px] uppercase'>Role</th>
              <th className='px-4 py-3 font-mono text-[10.5px] uppercase'>Status</th>
              <th className='px-4 py-3'></th>
            </tr>
          </thead>
          <tbody className='divide-y divide-[#DBDCD3] bg-white'>
            {recruiters.map((r) => (
              <tr key={r.id} className='hover:bg-[#EEF0EC] transition-colors'>
                <td className='px-4 py-3'>
                  <div className='flex items-center gap-2.5'>
                    <div className='w-7 h-7 rounded-full bg-[#E4EAE6] text-[#5C7A6E] flex items-center justify-center font-serif font-semibold text-[11px] shrink-0'>
                      {r.status === 'Pending' ? '—' : r.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span className='font-semibold text-[#0F1A2B]'>{r.name}</span>
                  </div>
                </td>
                <td className='px-4 py-3'>{r.status === 'Pending' ? '—' : r.openRoles}</td>
                <td className='px-4 py-3'>
                  <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full ${roleBadgeStyle[r.role]}`}>
                    {r.role}
                  </span>
                </td>
                <td className='px-4 py-3'>
                  <span className='inline-flex items-center gap-1.5 text-xs text-[#3C4A5E]'>
                    <span
                      className='w-1.5 h-1.5 rounded-full'
                      style={{ background: statusDotColor[r.status] }}
                    />
                    {r.status}
                  </span>
                </td>
                <td className='px-4 py-3'>
                  <button className='text-xs font-semibold text-[#C98A3E] hover:text-[#B67B33]'>
                    {r.status === 'Pending' ? 'Resend' : 'Manage'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobile cards */}
      <div className='sm:hidden flex flex-col gap-3'>
        {recruiters.map((r) => (
          <div key={r.id} className='bg-white border border-[#DBDCD3] rounded-md p-4'>
            <div className='flex justify-between items-start mb-2'>
              <span className='font-semibold text-sm text-[#0F1A2B]'>{r.name}</span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${roleBadgeStyle[r.role]}`}>
                {r.role}
              </span>
            </div>
            <div className='text-xs text-[#3C4A5E] flex items-center gap-1.5'>
              <span className='w-1.5 h-1.5 rounded-full' style={{ background: statusDotColor[r.status] }} />
              {r.status} · {r.status === 'Pending' ? 'no roles yet' : `${r.openRoles} open roles`}
            </div>
            <button className='text-xs font-semibold text-[#C98A3E] mt-2'>
              {r.status === 'Pending' ? 'Resend invite' : 'Manage'}
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}

export default ManageRecruiters