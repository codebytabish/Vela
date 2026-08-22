import React, { useState } from 'react'

const scoreBreakdown = [
  { label: 'Keyword match', value: 76, tone: 'brass' },
  { label: 'Formatting & parsing', value: 96, tone: 'harbor' },
  { label: 'Section completeness', value: 100, tone: 'harbor' },
  { label: 'Readability', value: 64, tone: 'brick' },
]

const matchedKeywords = ['Figma', 'Design systems', 'Product design', 'User research', 'Prototyping']
const missingKeywords = ['Healthcare', 'Regulated industry', 'Discovery research', 'Clinical ops', 'Scheduling platform']

const barColor = {
  brass: '#C98A3E',
  harbor: '#5C7A6E',
  brick: '#A6503E',
}

const AtsScore = () => {
  const overallScore = 83

  return (
    <div className='p-5'>

      <div className='flex justify-between items-center border-b border-[#DBDCD3] pb-5 mb-5'>
        <div>
          <h1 className='text-[22px] md:text-2xl font-serif font-bold text-[#0F1A2B]'>ATS score report</h1>
          <p className='text-[12.5px] text-[#3C4A5E]/70 mt-1'>Senior Product Designer · Northwind Health</p>
        </div>
        <button className='text-sm text-white bg-[#C98A3E] hover:bg-[#B67B33] cursor-pointer rounded py-2 px-3.5 transition-colors font-semibold'>
          Improve with AI →
        </button>
      </div>

      {/* score ring + breakdown */}
      <div className='grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-5 mb-5'>

        <div className='bg-white border border-[#DBDCD3] rounded-md p-7 flex flex-col items-center text-center'>
          <svg width="130" height="130">
            <circle cx="65" cy="65" r="56" fill="none" stroke="#DBDCD3" strokeWidth="9" />
            <circle
              cx="65" cy="65" r="56" fill="none" stroke="#5C7A6E" strokeWidth="9"
              strokeDasharray={2 * Math.PI * 56}
              strokeDashoffset={2 * Math.PI * 56 * (1 - overallScore / 100)}
              strokeLinecap="round"
              transform="rotate(-90 65 65)"
            />
          </svg>
          <div className='font-serif text-3xl font-semibold text-[#0F1A2B] -mt-[85px]'>{overallScore}</div>
          <div className='text-[11px] font-mono text-[#3C4A5E] mt-[4px]'>/ 100</div>
          <p className='text-[12.5px] text-[#3C4A5E] mt-15'>
            <strong className='text-[#5C7A6E]'>Strong match</strong> — a few keyword gaps remain.
          </p>
        </div>

        <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
          <div className='text-sm font-serif font-semibold text-[#0F1A2B] mb-4'>Score breakdown</div>
          {scoreBreakdown.map((b) => (
            <div key={b.label} className='mb-4 last:mb-0'>
              <div className='flex justify-between text-[13px] mb-1.5'>
                <span className='text-[#0F1A2B]'>{b.label}</span>
                <span className='font-mono text-[#3C4A5E]'>{b.value}%</span>
              </div>
              <div className='h-1.5 bg-[#DBDCD3] rounded-full overflow-hidden'>
                <div
                  className='h-full rounded-full'
                  style={{ width: `${b.value}%`, background: barColor[b.tone] }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* matched / missing keywords */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>

        <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
          <div className='text-sm font-serif font-semibold text-[#0F1A2B] mb-4'>
            Matched keywords ({matchedKeywords.length})
          </div>
          <div className='flex flex-wrap gap-2'>
            {matchedKeywords.map((kw) => (
              <span key={kw} className='text-[11px] font-mono bg-[#E4EAE6] text-[#5C7A6E] rounded-full px-2.5 py-1'>
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
          <div className='text-sm font-serif font-semibold text-[#0F1A2B] mb-4'>
            Missing keywords ({missingKeywords.length})
          </div>
          <div className='flex flex-wrap gap-2'>
            {missingKeywords.map((kw) => (
              <span key={kw} className='text-[11px] font-mono bg-[#F2E0DC] text-[#A6503E] rounded-full px-2.5 py-1'>
                {kw}
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}

export default AtsScore