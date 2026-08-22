import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const allJobs = [
  {
    id: 1,
    title: 'Senior Product Designer',
    company: 'Northwind Health',
    location: 'Remote',
    salary: '$145–170k',
    match: 91,
    seniority: 'Senior',
    workType: 'Remote',
    tags: ['Figma', 'Design systems', 'Healthcare'],
  },
  {
    id: 2,
    title: 'Design Systems Lead',
    company: 'Ridgeline Co.',
    location: 'Hybrid',
    salary: '$150–180k',
    match: 88,
    seniority: 'Lead',
    workType: 'Hybrid',
    tags: ['Systems', 'Leadership'],
  },
  {
    id: 3,
    title: 'Product Designer II',
    company: 'Fable Systems',
    location: 'Remote',
    salary: '$120–140k',
    match: 76,
    seniority: 'Mid',
    workType: 'Remote',
    tags: ['Figma', 'B2B SaaS'],
  },
  {
    id: 4,
    title: 'Staff Product Designer',
    company: 'Beacon Analytics',
    location: 'On-site',
    salary: '$180–210k',
    match: 68,
    seniority: 'Staff',
    workType: 'On-site',
    tags: ['Data viz', 'Systems'],
  },
]

const matchBuckets = [
  { id: '90plus', label: '90%+', test: (m) => m >= 90 },
  { id: '75to89', label: '75–89%', test: (m) => m >= 75 && m < 90 },
  { id: 'below75', label: 'Below 75%', test: (m) => m < 75 },
]

const workTypes = ['Remote', 'Hybrid', 'On-site']
const seniorities = ['Mid', 'Senior', 'Staff', 'Lead']

const matchColor = (match) => {
  if (match >= 85) return 'bg-[#E4EAE6] text-[#5C7A6E]'
  if (match >= 70) return 'bg-[#F5E7D2] text-[#8A5D22]'
  return 'bg-[#F2E0DC] text-[#A6503E]'
}

const Recommendations = () => {
  const navigate = useNavigate()

  const [activeBuckets, setActiveBuckets] = useState(['90plus', '75to89'])
  const [activeWorkTypes, setActiveWorkTypes] = useState(['Remote'])
  const [activeSeniorities, setActiveSeniorities] = useState(['Senior'])

  const toggle = (value, list, setList) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  const filteredJobs = allJobs.filter((job) => {
    const matchOk = activeBuckets.length === 0 || activeBuckets.some((b) =>
      matchBuckets.find((bucket) => bucket.id === b)?.test(job.match)
    )
    const workOk = activeWorkTypes.length === 0 || activeWorkTypes.includes(job.workType)
    const seniorityOk = activeSeniorities.length === 0 || activeSeniorities.includes(job.seniority)
    return matchOk && workOk && seniorityOk
  })

  const FilterCheckbox = ({ label, checked, onChange }) => (
    <label className='flex items-center gap-2 text-[12.5px] text-[#3C4A5E] mb-2 cursor-pointer'>
      <input type='checkbox' checked={checked} onChange={onChange} className='accent-[#C98A3E]' />
      {label}
    </label>
  )

  return (
    <div className='p-5'>

      <div className='mb-5  border-b border-[#DBDCD3] pb-5'>
        <h1 className='text-2xl md:text-3xl font-medium text-[#0F1A2B]'>Recommendations</h1>
        <p className='text-sm text-[#3C4A5E]/70 mt-1'>Roles plotted against your profile, ranked by match</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6'>

        {/* filters */}
        <div>
          <div className='mb-6'>
            <h5 className='text-[10.5px] font-mono uppercase tracking-wide text-[#3C4A5E] mb-2.5'>Match score</h5>
            {matchBuckets.map((b) => (
              <FilterCheckbox
                key={b.id}
                label={b.label}
                checked={activeBuckets.includes(b.id)}
                onChange={() => toggle(b.id, activeBuckets, setActiveBuckets)}
              />
            ))}
          </div>
          <div className='mb-6'>
            <h5 className='text-[10.5px] font-mono uppercase tracking-wide text-[#3C4A5E] mb-2.5'>Work type</h5>
            {workTypes.map((w) => (
              <FilterCheckbox
                key={w}
                label={w}
                checked={activeWorkTypes.includes(w)}
                onChange={() => toggle(w, activeWorkTypes, setActiveWorkTypes)}
              />
            ))}
          </div>
          <div>
            <h5 className='text-[10.5px] font-mono uppercase tracking-wide text-[#3C4A5E] mb-2.5'>Seniority</h5>
            {seniorities.map((s) => (
              <FilterCheckbox
                key={s}
                label={s}
                checked={activeSeniorities.includes(s)}
                onChange={() => toggle(s, activeSeniorities, setActiveSeniorities)}
              />
            ))}
          </div>
        </div>

        {/* job list */}
        <div className='flex flex-col gap-3.5'>
          {filteredJobs.length === 0 && (
            <div className='bg-white border border-[#DBDCD3] rounded-md p-8 text-center text-sm text-[#3C4A5E]'>
              No roles match your current filters.
            </div>
          )}

          {filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => navigate('/candidate/detail')}
              className='bg-white border border-[#DBDCD3] hover:border-[#0F1A2B] rounded-md p-5 flex justify-between gap-4 items-start cursor-pointer transition-colors'
            >
              <div>
                <div className='font-semibold text-[14.5px] text-[#0F1A2B]'>{job.title}</div>
                <div className='text-xs text-[#3C4A5E] mt-1'>
                  {job.company} · {job.location} · {job.salary}
                </div>
                <div className='flex gap-1.5 mt-3 flex-wrap'>
                  {job.tags.map((tag) => (
                    <span key={tag} className='text-[11px] font-mono border border-[#DBDCD3] text-[#3C4A5E] rounded-full px-2.5 py-1'>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`text-center shrink-0 rounded-full px-3 py-2 ${matchColor(job.match)}`}>
                <div className='font-serif text-lg font-semibold leading-none'>{job.match}</div>
                <div className='text-[9px] font-mono mt-0.5'>MATCH</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Recommendations