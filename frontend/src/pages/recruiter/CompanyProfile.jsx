import React, { useState } from 'react'

const isOrgAdmin = true // TODO: replace with real auth/role check later



const CompanyProfile = () => {

    if (!isOrgAdmin) {
  return (
    <div className='p-5'>
      <p className='text-sm text-[#3C4A5E]'>You don't have permission to view this page.</p>
    </div>
  )
}
  const [company, setCompany] = useState({
    name: 'Northwind Health',
    industry: 'Healthcare',
    domain: 'northwindhealth.com',
    about: 'Northwind Health builds patient scheduling and care coordination tools for regional healthcare networks.',
  })
  const setField = (field) => (e) => setCompany({ ...company, [field]: e.target.value })

  const team = [
    { id: 1, name: 'David Kwan', role: 'Admin' },
  ]

  const inputClass = 'w-full px-3 py-2.5 border border-[#DBDCD3] rounded-[5px] text-[13.5px] text-[#0F1A2B] bg-[#EEF0EC] focus:outline-none focus:border-[#C98A3E] transition-colors'
  const labelClass = 'block text-[11.5px] font-mono uppercase tracking-wide text-[#3C4A5E] mb-1.5'

  return (
    <div className='p-5'>

      <div className='mb-5'>
        <h1 className='text-2xl md:text-3xl font-serif font-medium text-[#0F1A2B]'>Company profile</h1>
        <p className='text-sm text-[#3C4A5E]/70 mt-1'>Manage your organization's details</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>

        {/* org identity */}
        <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
          <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Organization</h3>

          <div className='mb-4'>
            <label className={labelClass}>Company name</label>
            <input className={inputClass} value={company.name} onChange={setField('name')} />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4'>
            <div>
              <label className={labelClass}>Industry</label>
              <select className={inputClass} value={company.industry} onChange={setField('industry')}>
                <option value='Healthcare'>Healthcare</option>
                <option value='Technology'>Technology</option>
                <option value='Finance'>Finance</option>
                <option value='Law'>Law</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Domain</label>
              <input className={inputClass} value={company.domain} onChange={setField('domain')} />
            </div>
          </div>

          <div className='mb-6'>
            <label className={labelClass}>About</label>
            <textarea
              className={`${inputClass} min-h-[90px] resize-y`}
              value={company.about}
              onChange={setField('about')}
            />
          </div>

          <div className='flex justify-end'>
            <button className='bg-[#C98A3E] hover:bg-[#B67B33] rounded py-2 px-3.5 text-sm text-white font-medium transition-colors'>
              Save changes
            </button>
          </div>
        </div>

        {/* team, read-only for now */}
        <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='font-serif text-base font-semibold text-[#0F1A2B]'>Team</h3>
            <button
              disabled
              title='Coming soon'
              className='text-xs border border-[#DBDCD3] rounded px-2.5 py-1.5 text-[#3C4A5E]/50 cursor-not-allowed'
            >
              + Invite recruiter
            </button>
          </div>

          <div className='divide-y divide-[#DBDCD3]'>
            {team.map((member) => (
              <div key={member.id} className='flex justify-between items-center py-3'>
                <span className='text-sm text-[#0F1A2B]'>{member.name}</span>
                <span className='text-[11px] font-mono bg-[#F2E0DC] text-[#A6503E] rounded-full px-2.5 py-1'>
                  {member.role}
                </span>
              </div>
            ))}
          </div>

          <p className='text-[11.5px] text-[#3C4A5E] mt-4'>
            Inviting additional recruiters isn't available yet.
          </p>
        </div>

      </div>
    </div>
  )
}

export default CompanyProfile