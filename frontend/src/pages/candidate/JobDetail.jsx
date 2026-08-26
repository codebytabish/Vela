import React from 'react'
import { useNavigate } from 'react-router-dom'

const job = {
  title: 'Senior Product Designer',
  company: 'Northwind Health',
  location: 'Remote',
  salary: '$145–170k',
  match: 91,
  about: 'Lead end-to-end design for our patient scheduling platform. Partner with engineering and clinical operations, run discovery research, and own our design system.',
  requirements: [
    '5+ years product design experience',
    'Advanced Figma & design systems experience',
    'Healthcare or regulated industry background a plus',
  ],
  whyMatch: "Your Design Systems and Figma experience align closely. Northwind values discovery research and clinical-domain exposure — consider highlighting both before applying.",
}

const JobDetail = () => {
  const navigate = useNavigate()

  return (
    <div className='p-5'>

      <div className='flex justify-between items-center mb-5 border-[#DBDCD3] border-b pb-5'>
        <div>
          <h1 className='text-2xl md:text-3xl font-medium text-[#0F1A2B]'>Job detail</h1>
          <p className='text-sm text-[#3C4A5E]/70 mt-1'>{job.title} · {job.company}</p>
        </div>
        <button
          onClick={() => navigate('/candidate/search')}
          className='border border-[#DBDCD3] hover:border-[#0F1A2B] rounded py-2 px-3.5 text-sm text-[#0F1A2B] transition-colors'
        >
          ← Back to results
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6'>

        {/* left — job content */}
        <div>
          <div className='flex justify-between items-start gap-5 mb-6'>
            <div>
              <h2 className='font-serif text-xl md:text-2xl font-semibold text-[#0F1A2B]'>{job.title}</h2>
              <p className='text-sm text-[#3C4A5E] mt-1'>{job.company} · {job.location} · {job.salary}</p>
            </div>
            <div className='text-center shrink-0 bg-[#E4EAE6] text-[#5C7A6E] rounded-full px-4 py-2.5'>
              <div className='font-serif text-xl font-semibold leading-none'>{job.match}</div>
              <div className='text-[9px] font-mono mt-1'>MATCH</div>
            </div>
          </div>

          <div className='mb-6'>
            <h5 className='text-[11px] font-mono uppercase tracking-wide text-[#C98A3E] mb-2.5'>About the role</h5>
            <p className='text-[13.5px] text-[#2B333F] leading-relaxed'>{job.about}</p>
          </div>

          <div className='mb-6'>
            <h5 className='text-[11px] font-mono uppercase tracking-wide text-[#C98A3E] mb-2.5'>Requirements</h5>
            <ul className='list-disc pl-5 flex flex-col gap-1.5'>
              {job.requirements.map((r) => (
                <li key={r} className='text-[13.5px] text-[#2B333F] leading-relaxed'>{r}</li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className='text-[11px] font-mono uppercase tracking-wide text-[#C98A3E] mb-2.5'>Why it's a match</h5>
            <p className='text-[13.5px] text-[#2B333F] leading-relaxed'>{job.whyMatch}</p>
          </div>
        </div>

        {/* right — apply card */}
        <div className='bg-white border border-[#DBDCD3] rounded-md p-6 h-fit lg:sticky lg:top-5'>
          <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Apply</h3>
          <p className='text-[12.5px] text-[#3C4A5E] leading-relaxed mb-4'>
            Your "Product Design — Master" resume will be sent, scored at {job.match}%.
          </p>
          <button className='w-full bg-[#C98A3E] hover:bg-[#B67B33] rounded py-2.5 text-sm text-white font-medium mb-2.5 transition-colors'>
            Apply now
          </button>
          <button
            onClick={() => navigate('/candidate/improve')}
            className='w-full border border-[#DBDCD3] hover:border-[#0F1A2B] rounded py-2.5 text-sm text-[#0F1A2B] transition-colors'
          >
            Improve resume first
          </button>
        </div>

      </div>
    </div>
  )
}

export default JobDetail