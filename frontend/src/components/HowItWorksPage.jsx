import React from 'react'

const stops=[
{ tag: 'Stop 01', title: 'Chart your resume', body: 'Upload or build a resume. Vela parses experience, skills, and structure into a searchable profile.' },
  { tag: 'Stop 02', title: 'Plot against roles', body: 'Semantic search compares your profile to open roles by meaning, not just keyword overlap.' },
  { tag: 'Stop 03', title: 'Close the gaps', body: 'See exactly which skills and phrases are missing, with rewrite suggestions that keep your voice.' },
  { tag: 'Stop 04', title: 'Land the shortlist', body: "Recruiters see a ranked, explained shortlist — why each candidate matches, not just that they do." },
]

const HowItWorksPage = () => {
  return (
    <section className='bg-[#EEF0EC] p-17 border-t  border-[#DBDCD3] 'id='journey'>
    <div>
      <div>
        <p className='text-base font-bold  text-[#5C7A6E]/50'> — THE  ROUTE </p>
        <p className='text-4xl text-[#0F1A2B] font-bold'>
          Four stops between upload and <br/>
          offer.
        </p>
        <p className='pt-5 text-[#3C4A5E]'>
          Vela's engine handles the parsing and scoring work in the background — you see <br/>
          the route, not the machinery.
        </p>
      </div>

        <div className='relative '>
        {/* dotted connecting line behind the markers */}
        <div
          className='hidden md:block absolute top-[29px] left-0 right-0 h-px '
          style={{ backgroundImage: 'linear-gradient(to right, #DBDCD3 0 8px, transparent 8px 16px)', backgroundSize: '16px 1px' }}
        />

        <div className='grid grid-cols-1 md:grid-cols-4 gap-7 relative mt-10'>
          {stops.map((s) => (
            <div key={s.tag}>
              <div className='w-3.5 h-3.5 rounded-full bg-[#EEF0EC] border-2 border-[#C98A3E] mb-5 relative z-10' />
              <span className='block font-mono text-[10.5px] tracking-wider uppercase text-[#C98A3E] mb-2.5'>
                {s.tag}
              </span>
              <h3 className='text-[16.5px] font-semibold text-[#0F1A2B] mb-2'>{s.title}</h3>
              <p className='text-[13.5px] text-[#3C4A5E] leading-relaxed'>{s.body}</p>
            </div>
          ))}
        </div>
      </div>


    </div>
    </section>
  )
}

export default HowItWorksPage