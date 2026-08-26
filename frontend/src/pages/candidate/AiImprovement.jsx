import React from 'react'

const experienceBlocks = [
  {
    id: 1,
    company: 'Vantage Labs',
    role: 'Senior Product Designer',
    suggestions: [
      {
        id: 1,
        original: 'Led end-to-end product design for a B2B SaaS platform, partnering with engineering on a design system used across 4 product teams.',
        improved: 'Led end-to-end product design for a healthcare scheduling platform, partnering with engineering and clinical operations on a design system used across 4 product teams.',
      },
    ],
  },
  {
    id: 2,
    company: 'Fieldwork Co.',
    role: 'Product Designer',
    suggestions: [
      {
        id: 2,
        original: 'Ran user research to inform roadmap decisions in Figma.',
        improved: null,
      },
    ],
  },
]

const keyword = [
  { label: 'MISSING KEYWORD', title: 'Add "clinical operations" and "healthcare" — both appear in target roles but not in your resume.' },
]
const bullet = [
  { label: 'WEAK BULLET', title: '"Ran user research to inform roadmap decisions" is vague. Try quantifying scope and outcome.' },
]
const formatting = [
  { label: 'FORMATTING', title: 'Date formatting is inconsistent across roles. Standardize the dash style throughout.' },
]

const handleApply = () => {}

const AiImprovement = () => {
  return (
    <div className='p-5'>
      <div className='flex justify-between items-center sticky top-0 z-10 pb-5 border-b border-[#DBDCD3] bg-[#EEF0EC]  mb-5'>
        <div>
          <h1 className='text-2xl md:text-3xl font-serif font-medium text-[#0F1A2B]'>AI improvement</h1>
          <p className='text-sm text-[#3C4A5E]/70 mt-1'>Apply suggestions and watch your score update live</p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-5'>

        <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
          <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Experience</h3>

          {experienceBlocks.map((block, i) => (
            <div key={block.id} className={i !== 0 ? 'mt-5 pt-5 border-t border-[#DBDCD3]' : ''}>
              <p className='text-sm text-[#3C4A5E] mb-3'>{block.company} · {block.role}</p>
              <div className='flex flex-col gap-2'>
                {block.suggestions.map((suggestion) => (
                  <React.Fragment key={suggestion.id}>
                    <div className='text-[13.5px] text-[#0F1A2B] leading-relaxed px-3 py-2.5 bg-[#F2E0DC] border-l-2 border-[#A6503E]'>
                      {suggestion.original}
                    </div>
                    {suggestion.improved && (
                      <div className='text-[13.5px] text-[#0F1A2B] leading-relaxed px-3 py-2.5 bg-[#E4EAE6] border-l-2 border-[#5C7A6E]'>
                        {suggestion.improved}
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className='bg-white border border-[#DBDCD3] mb-4 rounded-md p-3'>
            {keyword.map((k) => (
              <div key={k.label} className='p-3'>
                <div className='text-[12px] font-mono uppercase tracking-wide text-[#7b5432] mb-2.5'>{k.label}</div>
                <div className='text-[12px] text-[#0F1A2B]'>{k.title}</div>
                <div className='flex gap-3 mt-4'>
                  <button className='cursor-pointer bg-[#C98A3E] hover:bg-[#B67B33] rounded px-3.5 py-2 text-[12px] text-white font-semibold' onClick={handleApply}>Apply</button>
                  <button className='cursor-pointer rounded px-3.5 py-2 text-[12px] text-[#0F1A2B] font-semibold border border-[#DBDCD3] hover:border-[#0F1A2B] bg-white' onClick={handleApply}>Dismiss</button>
                </div>
              </div>
            ))}
          </div>

          <div className='bg-white border border-[#DBDCD3] mb-4 rounded-md p-3'>
            {bullet.map((b) => (
              <div key={b.label} className='p-3'>
                <div className='text-[12px] font-mono uppercase tracking-wide text-[#7b5432] mb-2.5'>{b.label}</div>
                <div className='text-[12px] text-[#0F1A2B]'>{b.title}</div>
                <div className='flex gap-3 mt-4'>
                  <button className='cursor-pointer bg-[#C98A3E] hover:bg-[#B67B33] rounded px-3.5 py-2 text-[12px] text-white font-semibold' onClick={handleApply}>Apply</button>
                  <button className='cursor-pointer rounded px-3.5 py-2 text-[12px] text-[#0F1A2B] font-semibold border border-[#DBDCD3] hover:border-[#0F1A2B] bg-white' onClick={handleApply}>Dismiss</button>
                </div>
              </div>
            ))}
          </div>

          <div className='bg-white border border-[#DBDCD3] mb-4 rounded-md p-3'>
            {formatting.map((f) => (
              <div key={f.label} className='p-3'>
                <div className='text-[12px] font-mono uppercase tracking-wide text-[#7b5432] mb-2.5'>{f.label}</div>
                <div className='text-[12px] text-[#0F1A2B]'>{f.title}</div>
                <div className='flex gap-3 mt-4'>
                  <button className='cursor-pointer bg-[#C98A3E] hover:bg-[#B67B33] rounded px-3.5 py-2 text-[12px] text-white font-semibold' onClick={handleApply}>Fix</button>
                  <button className='cursor-pointer rounded px-3.5 py-2 text-[12px] text-[#0F1A2B] font-semibold border border-[#DBDCD3] hover:border-[#0F1A2B] bg-white' onClick={handleApply}>Dismiss</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default AiImprovement