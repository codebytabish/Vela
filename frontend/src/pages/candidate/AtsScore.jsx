import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'

const barColor = (v) => (v >= 80 ? '#5C7A6E' : v >= 60 ? '#C98A3E' : '#A6503E')
const verdict = (s) => (s >= 80 ? 'Strong match' : s >= 60 ? 'Good match' : 'Needs work')
const card = 'bg-white border border-[#DBDCD3] rounded-md p-6'

const AtsScore = () => {
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/resumes')
      .then((d) => setResume(d.resumes[0] || null))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const ats = resume?.ats

  if (loading) return <div className='p-5 text-sm text-[#3C4A5E]'>Loading…</div>

  if (!ats) {
    return (
      <div className='p-5'>
        <h1 className='text-2xl font-serif font-bold text-[#0F1A2B] mb-2'>ATS score report</h1>
        <div className={card}>
          <p className='text-sm text-[#3C4A5E] mb-4'>
            No score yet. Open the builder, add a target job, and click <strong>Save &amp; score</strong>.
          </p>
          <Link to='/candidate/builder' className='text-sm font-semibold text-[#C98A3E]'>Go to builder →</Link>
        </div>
      </div>
    )
  }

  const rows = [
    { label: 'Keyword match', value: ats.keyword },
    { label: 'Formatting & parsing', value: ats.formatting },
    { label: 'Section completeness', value: ats.sections },
    { label: 'Readability', value: ats.readability },
  ]
  const target = [ats.jobTitle, ats.company].filter(Boolean).join(' · ') || 'General check (no target job)'

  return (
    <div className='p-5'>
      <div className='flex justify-between items-center mb-5 border-b border-[#DBDCD3] pb-5'>
        <div>
          <h1 className='text-2xl font-serif font-bold text-[#0F1A2B]'>ATS score report</h1>
          <p className='text-sm text-[#3C4A5E]/70 mt-1'>
            {target} · scored {new Date(ats.scoredAt).toLocaleString()}
          </p>
        </div>
        <div className='flex gap-2.5'>
          <Link to='/candidate/builder' className='border border-[#DBDCD3] hover:border-[#0F1A2B] rounded py-2 px-3.5 text-sm text-[#0F1A2B]'>
            Edit resume
          </Link>
          <Link to='/candidate/improve' className='bg-[#C98A3E] hover:bg-[#B67B33] rounded py-2 px-3.5 text-sm text-white font-medium'>
            Improve with AI →
          </Link>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5 mb-5'>
        <div className={`${card} flex flex-col items-center`}>
          <div className='relative w-[150px] h-[150px]'>
            <svg width='150' height='150' className='-rotate-90'>
              <circle cx='75' cy='75' r='64' fill='none' stroke='#DBDCD3' strokeWidth='10' />
              <circle
                cx='75' cy='75' r='64' fill='none' stroke={barColor(ats.score)} strokeWidth='10'
                strokeDasharray='402' strokeDashoffset={402 * (1 - ats.score / 100)} strokeLinecap='round'
              />
            </svg>
            <div className='absolute inset-0 flex flex-col items-center justify-center'>
              <span className='font-mono text-3xl font-semibold text-[#0F1A2B]'>{ats.score}</span>
              <span className='font-mono text-[11px] text-[#3C4A5E]'>/ 100</span>
            </div>
          </div>
          <p className='mt-3.5 text-[12.5px] text-[#3C4A5E] text-center'>
            <strong className='text-[#0F1A2B]'>{verdict(ats.score)}</strong>
            {!ats.keywordScored && ' — add a job description for a keyword score.'}
          </p>
        </div>

        <div className={card}>
          <h3 className='text-[11.5px] font-mono uppercase tracking-wide text-[#3C4A5E] mb-4'>Score breakdown</h3>
          <div className='flex flex-col gap-4'>
            {rows.map((r) => (
              <div key={r.label}>
                <div className='flex justify-between text-[13px] mb-1.5'>
                  <span>{r.label}</span>
                  <span className='font-mono text-[#3C4A5E]'>{r.value == null ? '—' : `${r.value}%`}</span>
                </div>
                <div className='h-1.5 bg-[#DBDCD3] rounded-full overflow-hidden'>
                  <div className='h-full rounded-full' style={{ width: `${r.value ?? 0}%`, background: barColor(r.value ?? 0) }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {ats.keywordScored && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-5'>
          <div className={card}>
            <h3 className='text-sm font-semibold mb-3.5'>Matched keywords ({ats.matched.length})</h3>
            <div className='flex flex-wrap gap-2'>
              {ats.matched.map((k) => (
                <span key={k} className='text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#E4EAE6] text-[#5C7A6E]'>{k}</span>
              ))}
              {!ats.matched.length && <span className='text-sm text-[#3C4A5E]'>None found</span>}
            </div>
          </div>
          <div className={card}>
            <h3 className='text-sm font-semibold mb-3.5'>Missing keywords ({ats.missing.length})</h3>
            <div className='flex flex-wrap gap-2'>
              {ats.missing.map((k) => (
                <span key={k} className='text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#F2E0DC] text-[#A6503E]'>{k}</span>
              ))}
              {!ats.missing.length && <span className='text-sm text-[#3C4A5E]'>Nothing missing</span>}
            </div>
          </div>
        </div>
      )}

      <div className={card}>
        <h3 className='text-sm font-semibold mb-3.5'>What to fix</h3>
        <ul className='flex flex-col gap-2 text-[13px] text-[#2B333F] list-disc pl-5'>
          {ats.tips.map((t, i) => <li key={i}>{t}</li>)}
          {!ats.tips.length && <li>Nothing flagged. Nice work.</li>}
        </ul>
      </div>
    </div>
  )
}

export default AtsScore