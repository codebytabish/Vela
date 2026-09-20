import React from 'react'
import { useState } from 'react'
const candidateAiRanking = [
  {
    id: 1,
    name: 'Marisol Ferraira',
    experience: "6 years",
    company: 'Vintage Labs',
  }
]

const experiences = [
  { id: 1, title: "Senior Product Designer, Vantage Labs", role: "2022–Present · Led design system used across 4 teams" },
  { id: 2, title: "Product Designer, Fieldwork Co.", role: "2019–2022 · Ran user research programs" },
  { id: 3, title: "B.A. Design, UC Davis", role: "2015–2019" },
]


const skills = ["Figma", "Design Systems", "Healthcare exp.", "Clinical ops (partial)"]

const CandidateProfile = () => {

  const [matchesData, setMatchesData] = useState({
    why: 'Strong overlap on Figma and design-systems experience. Prior healthcare-adjacent project (patient portal redesign at Vantage Labs) closes most of the domain gap the role calls for.',
  })
  return (
    <div className=' p-5 sm:p-8'>
      <div className='flex justify-between items-center sticky top-0 z-10 pb-5 border-b border-[#DBDCD3] bg-[#EEF0EC]  mb-5'>
        <div>
          <h1 className='text-[16px] sm:text-2xl md:text-3xl font-fraunces font-bold text-[#0F1A2B]'>Candidate profile</h1>
          <p className='text-[11px] sm:text-[12px] text-[#3C4A5E] mt-1'>Applied to Senior Product Designer</p>
        </div>
        <div className='flex gap-2.5'>
          <button className=' cursor-pointer border bg-[#FFFFFF] font-semibold  border-[#DBDCD3] hover:border-[#0F1A2B] rounded px-3 py-2 sm:px-3.5 text-sm text-[#0F1A2B] transition-colors'>
            ←Back to ranking
          </button>
          <button className='text-sm text-white bg-[#C98A3E]  hover:bg-[#B67B33] cursor-pointer rounded px-3 py-2 sm:px-3.5 transition-colors font-semibold'>
            Schedule interview
          </button>
        </div>
      </div>


      <div className='flex justify-between mt-10'>

        <div className='flex gap-5'>
          <div className='w-15 h-15 mx-auto mb-3.5 rounded-full border border-[#DBDCD3] flex items-center justify-center font-mono text-[#8A5D22]  bg-[#F5E7D2]'>MF </div>


          <div>
            {candidateAiRanking.map((AiRanking, i) => (
              <div key={AiRanking.id} className={i !== 0 ? ' pt-5 border-t border-[#DBDCD3]' : ''}>
                <span className='text-2xl text-[#0F1A2B] mb-3 font-bold font-sans'> {AiRanking.name}</span>
                <p className='text-[12px] text-[#3C4A5E] mb-3'>{AiRanking.experience} · {AiRanking.company}</p>

              </div>
            ))}
          </div>
        </div>

        <div className='font-fraunces  text-[#5C7A6E]'>
          <span className='text-2xl'>91</span>
          <p className='text-[12px]'>Match</p>
        </div>



      </div>


      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-x-4 md:gap-y-2 mb-5 md:items-stretch'>

        {/* Why she matches —  */}
        <div className='md:col-span-2 md:col-start-1 md:row-start-1 bg-white border border-[#DBDCD3] rounded-md p-5 h-fit'>
          <h1 className='text-sm font-fraunces font-bold mb-3'>Why she matches</h1>
          <p className='text-[12px] text-[#3C4A5E]'>{matchesData.why}</p>
         <div className='flex gap-2 flex-wrap mt-3'>
  {skills.map((skill, i) => (
    <span
      key={i}
      className={`text-[11px] px-2.5 py-1 rounded-full shrink-0 border border-[#DBDCD3] font-jetbrains ${
        i === skills.length - 1 ? 'bg-[#F2E0DC] text-[#A6503E]' : 'bg-[#E4EAE6] text-[#5C7A6E]'
      }`}
    >
      {skill}
    </span>
  ))}
</div>
        </div>

        {/* Experience */}
        <div className='md:col-span-2 md:col-start-1 md:row-start-2 bg-white border border-[#DBDCD3] rounded-md p-5 h-fit'>
          <h1 className='text-sm font-fraunces font-bold mb-3'>Experience</h1>
          <div className='divide-y divide-[#DBDCD3]'>
            {experiences.map((i) => (
              <div key={i.id} className='flex justify-between items-center gap-4 py-3.5'>
                <div >
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 rounded-full bg-[#C98A3E] mt-1.5 shrink-0' />

                    <div className='font-semibold text-sm text-[#0F1A2B]'>{i.title}</div>
                  </div>

                  <div className='text-xs text-[#3C4A5E] mt-1 pl-4'>{i.role}</div>
                </div>
              
              </div>
            ))}
          </div>

        </div>

        {/* Actions  */}
        <div className='md:col-start-3 md:row-start-1 md:row-span-2 bg-white border border-[#DBDCD3] rounded-md p-4 h-fit'>
          <h1 className='text-sm font-fraunces font-bold mb-3'>Actions</h1>
          <div className='flex flex-col gap-2'>
            <button className='w-full text-sm text-white bg-[#C98A3E] hover:bg-[#B67B33] rounded px-3 py-2 font-semibold cursor-pointer transition-colors'>
              Schedule interview
            </button>
            <button className='w-full text-sm border border-[#DBDCD3] hover:border-[#0F1A2B] rounded px-3 py-2 font-semibold text-[#0F1A2B] cursor-pointer transition-colors'>
              Send message
            </button>
            <button className='w-full text-sm border border-[#DBDCD3] hover:border-[#0F1A2B] rounded px-3 py-2 font-semibold text-[#0F1A2B] cursor-pointer transition-colors'>
              Download resume
            </button>
          </div>
        </div>

      </div>

    </div>
  )
}

export default CandidateProfile