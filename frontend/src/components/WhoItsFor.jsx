import React from 'react'
import candidatePNG from '../assets/candidatePNG.png'
import recruiterPNG from '../assets/recruiterPNG.png'
import companyPNG from '../assets/companyPNG.png'

const WhoItsFor = () => {

const audiences = [
    {
      title: 'Candidates',
      png: candidatePNG,
      body: 'Build a resume that reads well to both humans and parsers, then track how it lands against real roles.',
      items: ['Resume builder & upload', 'AI resume improvement', 'Portfolio & skills graph', 'Job recommendations'],
    },
    {
      title: 'Recruiters',
      png: recruiterPNG,
      body: 'Post roles once and let ranking do the first pass, then move straight to scheduling the ones worth a call.',
      items: ['Job creation & templates', 'AI candidate ranking', 'Interview scheduling', 'Pipeline dashboard'],
    },
    {
      title: 'Companies',
      png: companyPNG,
      body: 'See hiring health across every team and recruiter, with the analytics to know where the pipeline stalls.',
      items: ['Recruiter management', 'Cross-team analytics', 'Hiring pipeline view', 'Role-based access'],
    },
  ]
  return (
    <section className='bg-[#EEF0EC] p-17 border-t border-[#DBDCD3]' id='whoitsfor'>
    <div >
      <div>
        <p className="text-xs font-bold text-[#5C7A6E]/50"> — Built for the whole hire</p>
        <h1 className='text-[#0F1A2B] font-bold font-mono text-4xl pt-3'>One chart room, four vantage</h1>
        <h1 className='text-[#0F1A2B] font-bold font-mono text-4xl'>points.</h1>
        <p className='pt-5 text-[#3C4A5E]'>
          Candidates, recruiters, and companies each get a workspace tuned to what<br/>
          they're steering.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-5 pt-10'>
        {audiences.map((a) => (
          <div key={a.title} className='bg-white border border-[#DBDCD3] rounded-md p-7 flex flex-col gap-4 hover:border-[#0F1A2B] hover:-translate-y-1 transition-all'>
            <img src={a.png} alt={a.title} className='w-10 h-10 object-contain' />
            <h3 className='font-serif text-[19px] font-semibold text-[#0F1A2B]'>{a.title}</h3>
            <p className='text-[13.5px] text-[#3C4A5E] leading-relaxed'>{a.body}</p>
            <ul className='flex flex-col gap-2'>
              {a.items.map((item) => (
                <li key={item} className='text-[12.5px] text-[#3C4A5E] flex gap-2'>
                  <span className='text-[#C98A3E]'>—</span>
                  {item}
                </li>
              ))}
            </ul>
            <span className='mt-auto text-[12.5px] font-semibold text-[#0F1A2B]'>
              Explore {a.title.toLowerCase()} tools →
            </span>
          </div>
        ))}
      </div>
      </div>
    </section>
  )
}

export default WhoItsFor