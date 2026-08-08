import React from 'react'

const Result = () => {
  return (
    <section id='results' className='p-17 border-t border-[#DBDCD3] bg-[#EEF0EC]'>
      <div className='max-w-[600px]'>
        <p className='flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#5C7A6E] mb-4'>
          <span className='w-[22px] h-px bg-[#5C7A6E]' />
          Why it matters
        </p>
        <p className='font-serif text-xl leading-relaxed text-[#0F1A2B]'>
          Every application is analyzed, scored, and ranked by AI, so recruiters begin
          with the candidates most likely to succeed.
        </p>
      </div>
    </section>
  )
}

export default Result