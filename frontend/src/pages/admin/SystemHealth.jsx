import React from 'react'

const aiMetrics = [
  { label: 'Resume parsing accuracy', detail: 'Rolling 7-day average', value: '94.2%', tone: 'harbor' },
  { label: 'Avg. ranking latency', detail: 'Time to score a candidate', value: '1.4s', tone: 'harbor' },
  { label: 'Embedding index freshness', detail: 'Last full re-index', value: '6h ago', tone: 'neutral' },
  { label: 'Interview question generation errors', detail: 'Failed generations / 10k requests', value: '12', tone: 'brass' },
]

// Each system has 30 days of uptime; 'ok' | 'warn' | 'down' per day
const uptimeSystems = [
  {
    name: 'API',
    uptime: '99.98%',
    days: Array.from({ length: 30 }, (_, i) => (i === 14 ? 'warn' : 'ok')),
  },
  {
    name: 'Matching engine',
    uptime: '99.91%',
    days: Array.from({ length: 30 }, (_, i) => (i === 9 ? 'down' : 'ok')),
  },
]

const dayColor = { ok: '#5C7A6E', warn: '#C98A3E', down: '#A6503E' }

const incidents = [
  { title: 'Matching engine degraded — elevated latency', time: 'Jul 21, 4:12–4:38 PM · resolved', status: 'Resolved' },
  { title: 'Scheduled maintenance — embedding index', time: 'Jul 15, 2:00–2:30 AM · resolved', status: 'Completed' },
]

const SystemHealth = () => {
  return (
    <div className='p-5'>

      <div className='mb-5'>
        <h1 className='text-2xl md:text-3xl font-serif font-medium text-[#0F1A2B]'>System & AI health</h1>
        <p className='text-sm text-[#3C4A5E]/70 mt-1'>Engine performance and uptime</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5'>

        <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
          <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>AI engine performance</h3>
          <div className='divide-y divide-[#DBDCD3]'>
            {aiMetrics.map((m) => (
              <div key={m.label} className='flex justify-between items-center py-3'>
                <div>
                  <div className='text-[13.5px] font-semibold text-[#0F1A2B]'>{m.label}</div>
                  <div className='text-xs text-[#3C4A5E] mt-0.5'>{m.detail}</div>
                </div>
                <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full shrink-0 ${
                  m.tone === 'harbor' ? 'bg-[#E4EAE6] text-[#5C7A6E]' :
                  m.tone === 'brass' ? 'bg-[#F5E7D2] text-[#8A5D22]' :
                  'bg-[#EDEDE8] text-[#3C4A5E]'
                }`}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
          <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Uptime, last 30 days</h3>
          {uptimeSystems.map((sys) => (
            <div key={sys.name} className='mb-4 last:mb-0'>
              <div className='text-[13.5px] font-semibold text-[#0F1A2B]'>{sys.name}</div>
              <div className='text-xs text-[#3C4A5E] mb-2'>{sys.uptime} uptime</div>
              <div className='flex gap-[2px]'>
                {sys.days.map((status, i) => (
                  <span
                    key={i}
                    className='w-1.5 h-4.5 rounded-[1px]'
                    style={{ background: dayColor[status] }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>

      <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
        <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Recent incidents</h3>
        <div className='divide-y divide-[#DBDCD3]'>
          {incidents.map((inc) => (
            <div key={inc.title} className='flex justify-between items-center py-3 gap-4'>
              <div>
                <div className='text-[13.5px] font-semibold text-[#0F1A2B]'>{inc.title}</div>
                <div className='text-xs text-[#3C4A5E] mt-0.5'>{inc.time}</div>
              </div>
              <span className='text-[11px] font-mono bg-[#E4EAE6] text-[#5C7A6E] rounded-full px-2.5 py-1 shrink-0'>
                {inc.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default SystemHealth