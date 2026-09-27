import React, { useState } from 'react'

const roles = ['Admin', 'Recruiter', 'Viewer']

const initialPermissions = [
  { id: 1, label: 'Post & edit roles', Admin: true, Recruiter: true, Viewer: false },
  { id: 2, label: 'View AI ranking & scores', Admin: true, Recruiter: true, Viewer: true },
  { id: 3, label: 'Schedule interviews', Admin: true, Recruiter: true, Viewer: false },
  { id: 4, label: 'Invite recruiters', Admin: true, Recruiter: false, Viewer: false },
  { id: 5, label: 'View org-wide analytics', Admin: true, Recruiter: false, Viewer: true },
  { id: 6, label: 'Manage billing', Admin: true, Recruiter: false, Viewer: false },
]

const RolesPermissions = () => {
  const [permissions, setPermissions] = useState(initialPermissions)

  const togglePermission = (id, role) => {
    setPermissions(permissions.map((p) =>
      p.id === id ? { ...p, [role]: !p[role] } : p
    ))
  }

  return (
    <div className='p-5'>

      <div className='flex justify-between items-center mb-5'>
        <div>
          <h1 className='text-2xl md:text-3xl font-serif font-medium text-[#0F1A2B]'>Roles & permissions</h1>
          <p className='text-sm text-[#3C4A5E]/70 mt-1'>Control what each role can see and do</p>
        </div>
        <button className='border border-[#DBDCD3] hover:border-[#0F1A2B] rounded py-2 px-3.5 text-sm text-[#0F1A2B] transition-colors'>
          + Custom role
        </button>
      </div>

      <div className='bg-white border border-[#DBDCD3] rounded-md p-6 overflow-x-auto'>
        <table className='w-full min-w-[520px]'>
          <thead>
            <tr>
              <th className='text-left pb-3'></th>
              {roles.map((role) => (
                <th key={role} className='pb-3 text-center font-mono text-[10.5px] text-[#3C4A5E] uppercase w-[100px]'>
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map((perm) => (
              <tr key={perm.id} className='border-t border-[#DBDCD3]'>
                <td className='py-3 text-sm text-[#0F1A2B]'>{perm.label}</td>
                {roles.map((role) => (
                  <td key={role} className='py-3 text-center'>
                    <button
                      onClick={() => togglePermission(perm.id, role)}
                      className={`w-4 h-4 rounded-[4px] border-[1.5px] inline-flex items-center justify-center transition-colors ${
                        perm[role] ? 'bg-[#5C7A6E] border-[#5C7A6E]' : 'border-[#DBDCD3]'
                      }`}
                      aria-pressed={perm[role]}
                      aria-label={`${perm.label} — ${role}`}
                    >
                      {perm[role] && <span className='text-white text-[10px] leading-none'>✓</span>}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default RolesPermissions