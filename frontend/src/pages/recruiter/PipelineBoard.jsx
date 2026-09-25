import { useState } from "react"
import React from 'react'
const stageColor = {
  New: '#3C4A5E',
  Screened: '#8A5D22',
  Interviewing: '#5C7A6E',
  Offer: '#5C7A6E',
  Hired: '#5C7A6E',
}


const PipelineBoard = () => {

    const [columns] = useState([
    {
      id: 'new',
      label: 'New',
      cards: [
        { id: 1, name: 'Jonah Kessler', meta: '4 yrs · Remote', match: 68 },
        { id: 2, name: 'Wren Castillo', meta: '3 yrs · Hybrid', match: 61 },
      ],
    },
    {
      id: 'screened',
      label: 'Screened',
      cards: [
        { id: 3, name: 'Sana Okafor', meta: '5 yrs · Chicago', match: 74 },
        { id: 4, name: 'Tom Whitfield', meta: '4 yrs · Remote', match: 79 },
      ],
    },
    {
      id: 'interviewing',
      label: 'Interviewing',
      cards: [
        { id: 5, name: 'Marisol Ferreira', meta: '6 yrs · SF', match: 91 },
        { id: 6, name: 'Priya Anand', meta: '7 yrs · Austin', match: 88 },
      ],
    },
    {
      id: 'offer',
      label: 'Offer',
      cards: [
        { id: 7, name: 'Lena Ostrowski', meta: '8 yrs · Remote', match: 93 },
      ],
    },
    {
      id: 'hired',
      label: 'Hired',
      cards: [],
    },
  ])
  return (
            <div className='p-5'>
         <div className='flex justify-between items-center sticky top-0 z-10 pb-5 border-b border-[#DBDCD3] bg-[#EEF0EC]  mb-5'>
        <div>
          <h1 className='text-2xl md:text-3xl font-serif font-medium text-[#0F1A2B]'>Pipeline board</h1>
          <p className='text-sm text-[#3C4A5E]/70 mt-1'>Senior Product Designer · 87 candidates</p>
        </div>
         </div>


               <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'>
        {columns.map((col) => (
          <div key={col.id} className='bg-white border border-[#DBDCD3] rounded-md p-3.5 min-h-[180px]'>
            <div className='flex justify-between items-center mb-3 px-0.5'>
              <span className='text-[10.5px] font-mono uppercase tracking-wide text-[#3C4A5E]'>
                {col.label}
              </span>
              <span className='text-[10.5px] font-mono text-[#3C4A5E]'>{col.cards.length}</span>
            </div>

            <div className='flex flex-col gap-2.5'>
              {col.cards.map((card) => (
                <div key={card.id} className='bg-[#EEF0EC] border border-[#DBDCD3] rounded-[5px] p-3'>
                  <div className='text-xs font-semibold text-[#0F1A2B]'>{card.name}</div>
                  <div className='text-[10.5px] text-[#3C4A5E] mt-0.5'>{card.meta}</div>
                  <div className='text-[10px] font-mono mt-2' style={{ color: stageColor[col.label] }}>
                    {card.match}% match
                  </div>
                </div>
              ))}
              {col.cards.length === 0 && (
                <div className='text-[11.5px] text-[#3C4A5E] text-center py-6'>Empty</div>
              )}
            </div>
          </div>
        ))}
      </div>



         </div>
  )
}

export default PipelineBoard