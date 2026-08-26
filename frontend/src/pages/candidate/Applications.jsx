import React from 'react'

const columns = [
  {
    id: 'applied',
    label: 'Applied',
    accent: '#3C4A5E',
    cards: [
      { id: 1, title: 'Product Designer II', company: 'Fable Systems', date: 'Applied Jul 30' },
      { id: 2, title: 'UX Designer', company: 'Hearth Financial', date: 'Applied Jul 27' },
      { id: 3, title: 'Product Designer', company: 'Loom & Co.', date: 'Applied Jul 22' },
    ],
  },
  {
    id: 'interviewing',
    label: 'Interviewing',
    accent: '#8A5D22',
    cards: [
      { id: 4, title: 'Senior Product Designer', company: 'Northwind Health', date: 'Interview Aug 4' },
      { id: 5, title: 'Design Systems Lead', company: 'Ridgeline Co.', date: 'Interview Aug 7' },
    ],
  },
  {
    id: 'offer',
    label: 'Offer',
    accent: '#5C7A6E',
    cards: [
      { id: 6, title: 'Senior Designer, Platform', company: 'Ridgeline Co.', date: 'Offer received Jul 29' },
    ],
  },
  {
    id: 'closed',
    label: 'Closed',
    accent: '#A6503E',
    cards: [
      { id: 7, title: 'Staff Designer', company: 'Beacon Analytics', date: 'Declined Jul 15' },
    ],
  },
]

const Applications = () => {
  const totalActive = columns
    .filter((c) => c.id !== 'closed')
    .reduce((sum, c) => sum + c.cards.length, 0)

  return (
    <div className='p-5'>

      <div className='mb-5'>
        <h1 className='text-2xl md:text-3xl font-medium text-[#0F1A2B]'>Applications</h1>
        <p className='text-sm text-[#3C4A5E]/70 mt-1'>
          {totalActive} active · tracked automatically as recruiters respond
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {columns.map((col) => (
          <div key={col.id} className='bg-white border border-[#DBDCD3] rounded-md p-3.5 min-h-[200px]'>
            <div className='flex justify-between items-center mb-3 px-0.5'>
              <span className='text-[10.5px] font-mono uppercase tracking-wide text-[#3C4A5E]'>
                {col.label}
              </span>
              <span className='text-[10.5px] font-mono text-[#3C4A5E]'>{col.cards.length}</span>
            </div>

            <div className='flex flex-col gap-2.5'>
              {col.cards.map((card) => (
                <div key={card.id} className='bg-[#EEF0EC] border border-[#DBDCD3] rounded-[5px] p-3'>
                  <div className='text-xs font-semibold text-[#0F1A2B]'>{card.title}</div>
                  <div className='text-[10.5px] text-[#3C4A5E] mt-0.5'>{card.company}</div>
                  <div className='text-[10px] font-mono mt-2' style={{ color: col.accent }}>
                    {card.date}
                  </div>
                </div>
              ))}
              {col.cards.length === 0 && (
                <div className='text-[11.5px] text-[#3C4A5E] text-center py-6'>No applications here yet</div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Applications