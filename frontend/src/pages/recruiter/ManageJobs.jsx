import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const statusStyle = (status) => {
  if (status === 'Open') return 'bg-[#E4EAE6] text-[#5C7A6E]'
  if (status === 'Draft') return 'bg-[#F5E7D2] text-[#8A5D22]'
  return 'bg-[#F2E0DC] text-[#A6503E]'
}

const ManageJobs = () => {
  const navigate = useNavigate()

  const [jobs] = useState([
    { id: 1, role: 'Senior Product Designer', applicants: 87, topMatch: 91, status: 'Open', posted: 'Jul 18' },
    { id: 2, role: 'Design Systems Lead', applicants: 54, topMatch: 88, status: 'Open', posted: 'Jul 22' },
    { id: 3, role: 'Product Designer II', applicants: 54, topMatch: 88, status: 'Open', posted: 'Jul 22' },
  ])

  return (
    <div className='p-5'>
      <div className='flex justify-between items-center sticky top-0 z-10 pb-5 border-b border-[#DBDCD3] bg-[#EEF0EC] mb-5'>
        <div>
          <h1 className='text-2xl md:text-3xl font-serif font-medium text-[#0F1A2B]'>Manage Jobs</h1>
          <p className='text-[11px] sm:text-[12px] text-[#3C4A5E] mt-1'>4 open · 2 closed this quarter</p>
        </div>
        <button
          onClick={() => navigate('/recruiter/create')}
          className='text-sm text-white bg-[#C98A3E] hover:bg-[#B67B33] cursor-pointer rounded py-2 px-3.5 transition-colors font-semibold'
        >
          + Post a role
        </button>
      </div>

      <div className='overflow-x-auto border border-[#DBDCD3] rounded-lg'>
        <table className='hidden sm:table min-w-full divide-y divide-[#DBDCD3] text-sm'>
          <thead className='bg-white'>
            <tr className='text-[#3C4A5E] text-left'>
              <th className='px-4 py-3 whitespace-nowrap font-mono text-[10.5px] uppercase'>Role</th>
              <th className='px-4 py-3 whitespace-nowrap font-mono text-[10.5px] uppercase'>Applicants</th>
              <th className='px-4 py-3 whitespace-nowrap font-mono text-[10.5px] uppercase'>Top match</th>
              <th className='px-4 py-3 whitespace-nowrap font-mono text-[10.5px] uppercase'>Status</th>
              <th className='px-4 py-3 whitespace-nowrap font-mono text-[10.5px] uppercase'>Posted</th>
              <th className='px-4 py-3'></th>
            </tr>
          </thead>

          <tbody className='divide-y divide-[#DBDCD3] bg-white'>
            {jobs.map((job) => (
              <tr key={job.id} className='hover:bg-[#EEF0EC] transition-colors'>
                <td className='px-4 py-3 font-semibold text-[#0F1A2B]'>{job.role}</td>
                <td className='px-4 py-3'>{job.applicants}</td>
                <td className='px-4 py-3 font-mono'>{job.topMatch}%</td>
                <td className='px-4 py-3'>
                  <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full ${statusStyle(job.status)}`}>
                    {job.status}
                  </span>
                </td>
                <td className='px-4 py-3 font-mono text-[#3C4A5E]'>{job.posted}</td>
                <td className='px-4 py-3'>
                  <button
                    onClick={() => navigate('/recruiter/ranking')}
                    className='text-xs font-semibold text-[#C98A3E] hover:text-[#B67B33]'
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* mobile cards */}
<div className='sm:hidden flex flex-col gap-3'>
  {jobs.map((job) => (
    <div key={job.id} className='bg-white border border-[#DBDCD3] rounded-md p-4'>
      <div className='flex justify-between items-start mb-2'>
        <span className='font-semibold text-sm text-[#0F1A2B]'>{job.role}</span>
        <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${statusStyle(job.status)}`}>
          {job.status}
        </span>
      </div>
      <div className='text-xs text-[#3C4A5E]'>{job.applicants} applicants · {job.topMatch}% top match</div>
      <div className='text-xs text-[#3C4A5E] mt-1'>Posted {job.posted}</div>
    </div>
  ))}
</div>


    </div>
  )
}

export default ManageJobs