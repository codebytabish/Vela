import React from 'react'

const instruments = [
  { n: '01', title: 'Resume parsing', body: 'Turns unstructured resumes into clean, structured fields in seconds.' },
  { n: '02', title: 'Semantic search', body: 'Matches by meaning and context, not just literal keyword overlap.' },
  { n: '03', title: 'Embeddings & similarity', body: 'Scores fit using vector similarity across skills, roles, and history.' },
  { n: '04', title: 'ATS scoring', body: 'Predicts how a resume will read to real applicant tracking systems.' },
  { n: '05', title: 'Skill extraction', body: 'Builds a skills graph from experience text without manual tagging.' },
  { n: '06', title: 'Gap detection', body: 'Flags exactly which required skills a profile is missing for a role.' },
  { n: '07', title: 'Interview questions', body: 'Generates role-specific questions from the actual job description.' },
  { n: '08', title: 'Career guidance', body: 'Suggests next roles and skill gaps to close based on trajectory.' },
]

const Feature = () => {
  return (
    <section id='features' className='bg-[#0F1A2B] p-17'>
      <div className='max-w-[600px] mb-12'>
        <p className='flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#5C7A6E] mb-4'>
          <span className='w-[22px] h-px bg-[#5C7A6E]' />
          The instrument panel
        </p>
        <h2 className='font-serif text-[32px] font-semibold text-white leading-tight mb-3'>
          One engine, instead of eight tools bolted together.
        </h2>
        <p className='text-[15px] text-[#9AA5B4] leading-relaxed'>
          Every AI feature below runs on Vela's own matching engine — no juggling separate APIs for parsing, search, and scoring.
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-lg overflow-hidden'>
        {instruments.map((i) => (
          <div key={i.n} className='bg-[#132038] p-6'>
            <span className='inline-block text-[11px] font-mono text-[#DCE1E8] bg-white/[0.06] border border-white/[0.16] rounded-full px-2.5 py-1 mb-4'>
              {i.n}
            </span>
            <h4 className='text-[14.5px] font-semibold text-white mb-2'>{i.title}</h4>
            <p className='text-[12.5px] text-[#9AA5B4] leading-relaxed'>{i.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Feature