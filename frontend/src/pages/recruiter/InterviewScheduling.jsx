import React, { useState } from 'react'
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const calendarDays = [
  { date: 3, events: [] },
  { date: 4, events: ['2:00 M. Ferreira'], isToday: true },
  { date: 5, events: ['10:30 P. Anand'] },
  { date: 6, events: [] },
  { date: 7, events: ['1:00 S. Okafor'] },
  { date: 8, events: [] },
  { date: 9, events: [] },
]

const availableSlots = [
  { id: 1, time: 'Tue Aug 4 · 2:00 PM', recommended: true },
  { id: 2, time: 'Tue Aug 4 · 4:00 PM' },
  { id: 3, time: 'Wed Aug 5 · 9:00 AM' },
  { id: 4, time: 'Thu Aug 6 · 11:00 AM' },
]



const InterviewScheduling = () => {
    const [booked, setBooked] = useState(null)
  return (
    <div className='p-5'>
         <div className='flex justify-between items-center sticky top-0 z-10 pb-5 border-b border-[#DBDCD3] bg-[#EEF0EC]  mb-5'>
        <div>
          <h1 className='text-2xl md:text-3xl font-serif font-medium text-[#0F1A2B]'>Interview scheduling</h1>
          <p className='text-sm text-[#3C4A5E]/70 mt-1'>Week of August 3</p>
        </div>
      
         <button className='text-sm text-white bg-[#C98A3E]  hover:bg-[#B67B33] cursor-pointer rounded px-3 py-2 sm:px-3.5 transition-colors font-semibold'>
            + New interview
          </button>
        </div>




         <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>

        {/* calendar */}
        <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
          <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>This week</h3>

          <div className='grid grid-cols-7 mb-2'>
            {weekDays.map((d) => (
              <div key={d} className='text-[10.5px] font-mono uppercase text-[#3C4A5E] text-center'>
                {d}
              </div>
            ))}
          </div>

          <div className='grid grid-cols-7 gap-px bg-[#DBDCD3] border border-[#DBDCD3] rounded-md overflow-hidden'>
            {calendarDays.map((day) => (
              <div
                key={day.date}
                className={`min-h-[96px] p-2 ${day.isToday ? 'bg-[#F5E7D2]' : 'bg-white'}`}
              >
                <div className='text-[11px] font-mono text-[#3C4A5E] mb-1.5'>{day.date}</div>
                {day.events.map((ev) => (
                  <div
                    key={ev}
                    className='text-[10px] bg-[#E4EAE6] text-[#5C7A6E] rounded px-1.5 py-1 mb-1'
                  >
                    {ev}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* available slots */}
        <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
          <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>
            Available slots — Marisol Ferreira
          </h3>
          <div className='flex flex-col gap-2.5'>
            {availableSlots.map((slot) => (
              <div
                key={slot.id}
                className='flex justify-between items-center p-3.5 border border-[#DBDCD3] rounded-[5px]'
              >
                <span className='text-sm text-[#0F1A2B]'>{slot.time}</span>
                <button
                  onClick={() => setBooked(slot.id)}
                  disabled={booked === slot.id}
                  className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${
                    booked === slot.id
                      ? 'bg-[#5C7A6E] text-white cursor-default'
                      : slot.recommended
                      ? 'bg-[#C98A3E] hover:bg-[#B67B33] text-white'
                      : 'border border-[#DBDCD3] hover:border-[#0F1A2B] text-[#0F1A2B]'
                  }`}
                >
                  {booked === slot.id ? 'Booked ✓' : 'Book'}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
        </div>
  )
}

export default InterviewScheduling