import React from 'react'
import { useState } from 'react'


const AiRanking = () => {
  const [candidates] = useState([
  { id: 1, name: 'Marisol Ferreira', years: 6, company: 'Vantage Labs', location: 'San Francisco, CA', tags: ['Figma', 'Design systems', 'Healthcare exp.'], match: 91 },
  { id: 2, name: 'Priya Anand', years: 7, company: 'Bluewell Health', location: 'Austin, TX', tags: ['Figma', 'Clinical ops'], match: 88 },
  { id: 3, name: 'Tom Whitfield', years: 4, company: 'Fable Systems', location: 'Remote', tags: ['Design systems', 'Prototyping'], match: 79 },
])
  return (
    

        <div className=' p-5 sm:p-8'>
                <div className='flex justify-between items-center sticky top-0 z-10 pb-5 border-b border-[#DBDCD3] bg-[#EEF0EC]  mb-5'>
                          <div>
          <h1 className='text-[16px] sm:text-2xl md:text-3xl font-fraunces font-bold text-[#0F1A2B]'>AI ranking</h1>
          <p className='text-[11px] sm:text-[12px] text-[#3C4A5E] mt-1'>Senior Product Designer · 87 candidates plotted</p>
        </div>
          <button className=' cursor-pointer border bg-[#FFFFFF] font-semibold  border-[#DBDCD3] hover:border-[#0F1A2B] rounded px-3 py-2 sm:px-3.5 text-sm text-[#0F1A2B] transition-colors'>
            Adjust Weights 
          </button>
</div>


{candidates.map((c, i) => (
  <div
    key={c.id}
    onClick={() => navigate('/recruiter/profile')}
    className='flex items-center gap-4 p-4 border border-[#DBDCD3] rounded-md bg-white mb-3 cursor-pointer hover:border-[#0F1A2B] transition-colors'
  >
    <div className='font-serif text-xl font-semibold text-[#3C4A5E] w-7 shrink-0'>
      {String(i + 1).padStart(2, '0')}
    </div>

    <div className='w-9 h-9 rounded-full bg-[#F5E7D2] text-[#8A5D22] flex items-center justify-center font-serif font-semibold text-[13px] shrink-0'>
      {c.name.split(' ').map((n) => n[0]).join('')}
    </div>

    <div className='flex-1'>
      <div className='font-semibold text-[13.5px] text-[#0F1A2B]'>{c.name}</div>
      <div className='text-xs text-[#3C4A5E] mt-0.5'>{c.years} yrs · {c.company} · {c.location}</div>
      <div className='flex gap-1.5 mt-2 flex-wrap'>
        {c.tags.map((tag) => (
          <span key={tag} className='text-[11px] border border-[#DBDCD3] text-[#3C4A5E] rounded-full px-2 py-0.5'>
            {tag}
          </span>
        ))}
      </div>
    </div>

    <div className='text-center shrink-0'>
      <div className='font-serif text-xl font-semibold text-[#5C7A6E]'>{c.match}</div>
      <div className='text-[9px] font-mono text-[#3C4A5E]'>MATCH</div>
    </div>
  </div>
))}


</div>
  )
}

export default AiRanking