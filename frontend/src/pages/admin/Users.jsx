import React, { useState } from 'react'

const roleBadgeStyle = {
  Candidate: 'bg-[#E4EAE6] text-[#5C7A6E]',
  Recruiter: 'bg-[#F5E7D2] text-[#8A5D22]',
  'Org admin': 'bg-[#EDEDE8] text-[#3C4A5E]',
}

const statusStyle = {
  Active: { dot: '#5C7A6E', text: 'Active' },
  'Pending verify': { dot: '#C98A3E', text: 'Pending verify' },
  Suspended: { dot: '#A6503E', text: 'Suspended' },
}

const Users = () => {
  const [search, setSearch] = useState('')

  const [users] = useState([
    { id: 1, name: 'Marisol Ferreira', role: 'Candidate', company: '—', joined: 'Mar 2025', status: 'Active' },
    { id: 2, name: 'David Kwan', role: 'Recruiter', company: 'Northwind Health', joined: 'Jan 2025', status: 'Active' },
    { id: 3, name: 'Elena Ruiz', role: 'Org admin', company: 'Northwind Health', joined: 'Nov 2024', status: 'Active' },
    { id: 4, name: 'Tom Whitfield', role: 'Candidate', company: '—', joined: 'Jun 2025', status: 'Pending verify' },
    { id: 5, name: 'Jared Dunn', role: 'Recruiter', company: 'Beacon Analytics', joined: 'Feb 2025', status: 'Suspended' },
  ])

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.company.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='p-5'>

      <div className='flex justify-between items-center mb-5'>
        <div>
          <h1 className='text-2xl md:text-3xl font-serif font-medium text-[#0F1A2B]'>User management</h1>
          <p className='text-sm text-[#3C4A5E]/70 mt-1'>84,210 users across all roles</p>
        </div>
        <button className='border border-[#DBDCD3] hover:border-[#0F1A2B] rounded py-2 px-3.5 text-sm text-[#0F1A2B] transition-colors'>
          Export CSV
        </button>
      </div>

      <input
        type='text'
        placeholder='Search by name, email, or company…'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='w-full px-4 py-2.5 border border-[#DBDCD3] rounded-[5px] text-[13.5px] bg-white mb-4 focus:outline-none focus:border-[#C98A3E] transition-colors'
      />

      <div className='hidden sm:block overflow-x-auto border border-[#DBDCD3] rounded-lg'>
        <table className='w-full min-w-[680px] divide-y divide-[#DBDCD3] text-sm'>
          <thead className='bg-white'>
            <tr className='text-[#3C4A5E] text-left'>
              <th className='px-4 py-3 font-mono text-[10.5px] uppercase'>User</th>
              <th className='px-4 py-3 font-mono text-[10.5px] uppercase'>Role</th>
              <th className='px-4 py-3 font-mono text-[10.5px] uppercase'>Company</th>
              <th className='px-4 py-3 font-mono text-[10.5px] uppercase'>Joined</th>
              <th className='px-4 py-3 font-mono text-[10.5px] uppercase'>Status</th>
              <th className='px-4 py-3'></th>
            </tr>
          </thead>
          <tbody className='divide-y divide-[#DBDCD3] bg-white'>
            {filtered.map((u) => (
              <tr key={u.id} className='hover:bg-[#EEF0EC] transition-colors'>
                <td className='px-4 py-3'>
                  <div className='flex items-center gap-2.5'>
                    <div className='w-7 h-7 rounded-full bg-[#E4EAE6] text-[#5C7A6E] flex items-center justify-center font-serif font-semibold text-[11px] shrink-0'>
                      {u.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span className='font-semibold text-[#0F1A2B]'>{u.name}</span>
                  </div>
                </td>
                <td className='px-4 py-3'>
                  <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full ${roleBadgeStyle[u.role]}`}>
                    {u.role}
                  </span>
                </td>
                <td className='px-4 py-3 text-[#3C4A5E]'>{u.company}</td>
                <td className='px-4 py-3 font-mono text-[#3C4A5E]'>{u.joined}</td>
                <td className='px-4 py-3'>
                  <span className='inline-flex items-center gap-1.5 text-xs text-[#3C4A5E]'>
                    <span className='w-1.5 h-1.5 rounded-full' style={{ background: statusStyle[u.status].dot }} />
                    {statusStyle[u.status].text}
                  </span>
                </td>
                <td className='px-4 py-3'>
                  <button className='text-xs font-semibold text-[#C98A3E] hover:text-[#B67B33]'>View</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan='6' className='px-4 py-8 text-center text-sm text-[#3C4A5E]'>
                  No users match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* mobile cards */}
      <div className='sm:hidden flex flex-col gap-3'>
        {filtered.map((u) => (
          <div key={u.id} className='bg-white border border-[#DBDCD3] rounded-md p-4'>
            <div className='flex justify-between items-start mb-2'>
              <span className='font-semibold text-sm text-[#0F1A2B]'>{u.name}</span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${roleBadgeStyle[u.role]}`}>
                {u.role}
              </span>
            </div>
            <div className='text-xs text-[#3C4A5E]'>{u.company} · joined {u.joined}</div>
            <div className='text-xs text-[#3C4A5E] flex items-center gap-1.5 mt-1'>
              <span className='w-1.5 h-1.5 rounded-full' style={{ background: statusStyle[u.status].dot }} />
              {statusStyle[u.status].text}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Users