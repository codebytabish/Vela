import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'

const card = 'bg-white border border-[#DBDCD3] rounded-md p-6'

const MATCH = [
  { id: 'top', label: '90%+', test: (m) => m >= 90 },
  { id: 'good', label: '75–89%', test: (m) => m >= 75 && m < 90 },
  { id: 'low', label: 'Below 75%', test: (m) => m < 75 },
]
const WORK = [
  { id: 'remote', label: 'Remote' },
  { id: 'hybrid', label: 'Hybrid' },
  { id: 'onsite', label: 'On-site' },
]
const LEVEL = [
  { id: 'intern', label: 'Intern' },
  { id: 'junior', label: 'Junior' },
  { id: 'mid', label: 'Mid' },
  { id: 'senior', label: 'Senior' },
  { id: 'staff', label: 'Staff' },
  { id: 'lead', label: 'Lead' },
]

const workLabel = (id) => WORK.find((w) => w.id === id)?.label || id
const levelLabel = (id) => LEVEL.find((l) => l.id === id)?.label || id
const matchStyle = (m) =>
  m >= 90 ? 'bg-[#E4EAE6] text-[#5C7A6E]' : m >= 75 ? 'bg-[#F5E7D2] text-[#8A5D22]' : 'bg-[#F2E0DC] text-[#A6503E]'

const Group = ({ title, options, selected, onToggle }) => (
  <div>
    <div className='font-mono text-[10.5px] uppercase tracking-wide text-[#3C4A5E] mb-2'>{title}</div>
    <div className='flex flex-wrap gap-1.5'>
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onToggle(o.id)}
          className={`cursor-pointer text-xs px-3 py-1.5 rounded-full border transition-colors ${
            selected.has(o.id)
              ? 'bg-[#0F1A2B] text-white border-[#0F1A2B]'
              : 'border-[#DBDCD3] text-[#3C4A5E] hover:border-[#0F1A2B]'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  </div>
)

const Recommendation = () => {
  const [jobs, setJobs] = useState([])
  const [hasResume, setHasResume] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [match, setMatch] = useState(() => new Set())
  const [work, setWork] = useState(() => new Set())
  const [level, setLevel] = useState(() => new Set())

  useEffect(() => {
    api('/jobs/recommendations')
      .then((d) => { setHasResume(d.hasResume); setJobs(d.jobs) })
      .catch((e) => setError(e.message || 'Could not load roles'))
      .finally(() => setLoading(false))
  }, [])

  const toggle = (setter) => (id) =>
    setter((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  const visible = jobs.filter(
    (j) =>
      (match.size === 0 || MATCH.some((m) => match.has(m.id) && m.test(j.match))) &&
      (work.size === 0 || work.has(j.workType)) &&
      (level.size === 0 || level.has(j.seniority))
  )
  const filtering = match.size + work.size + level.size > 0
  const clear = () => { setMatch(new Set()); setWork(new Set()); setLevel(new Set()) }

  if (loading) return <div className='p-5 text-sm text-[#3C4A5E]'>Matching roles to your profile…</div>

  if (!hasResume) {
    return (
      <div className='p-5'>
        <h1 className='text-2xl font-serif font-bold text-[#0F1A2B] mb-2'>Recommendations</h1>
        <div className={card}>
          <p className='text-sm text-[#3C4A5E] mb-4'>I need your resume to rank roles for you.</p>
          <div className='flex gap-4'>
            <Link to='/candidate/builder' className='text-sm font-semibold text-[#C98A3E]'>Build one →</Link>
            <Link to='/candidate/upload' className='text-sm font-semibold text-[#C98A3E]'>Upload one →</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='p-5'>
      <div className='mb-5 border-b border-[#DBDCD3] pb-5'>
        <h1 className='text-2xl font-serif font-bold text-[#0F1A2B]'>Recommendations</h1>
        <p className='text-sm text-[#3C4A5E]/70 mt-1'>Roles plotted against your profile, ranked by match</p>
      </div>

      {error && <p className='text-sm text-[#A6503E] mb-3'>{error}</p>}

      <div className={`${card} mb-5 grid grid-cols-1 md:grid-cols-3 gap-5`}>
        <Group title='Match score' options={MATCH} selected={match} onToggle={toggle(setMatch)} />
        <Group title='Work type' options={WORK} selected={work} onToggle={toggle(setWork)} />
        <Group title='Seniority' options={LEVEL} selected={level} onToggle={toggle(setLevel)} />
      </div>

      <div className='flex items-center justify-between mb-3'>
        <span className='text-xs text-[#3C4A5E]'>Showing {visible.length} of {jobs.length} roles</span>
        {filtering && (
          <button onClick={clear} className='text-xs font-semibold text-[#C98A3E] hover:underline'>Clear filters</button>
        )}
      </div>

      {jobs.length === 0 && (
        <div className={card}>
          <p className='text-sm text-[#3C4A5E]'>No open roles yet. They appear here as soon as they are posted.</p>
        </div>
      )}

      {jobs.length > 0 && visible.length === 0 && (
        <div className={card}>
          <p className='text-sm text-[#3C4A5E]'>No roles match these filters.</p>
        </div>
      )}

      <div className='flex flex-col gap-3.5'>
        {visible.map((j) => (
          <Link
  key={j.id}
  to={`/candidate/detail?job=${j.id}`}
  className='block bg-white border border-[#DBDCD3] hover:border-[#C98A3E] rounded-md p-5 transition-colors'
>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <div className='flex items-center gap-2 flex-wrap'>
                  <h3 className='font-semibold text-[14.5px] text-[#0F1A2B]'>{j.title}</h3>
                  {j.isSample && (
                    <span className='font-mono text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border border-[#DBDCD3] text-[#3C4A5E]'>
                      Sample listing
                    </span>
                  )}
                </div>
                <div className='text-xs text-[#3C4A5E] mt-1'>
                  {[
                    j.company,
                    workLabel(j.workType) + (j.workType !== 'remote' && j.location ? ` (${j.location})` : ''),
                    levelLabel(j.seniority),
                    j.salary,
                  ].filter(Boolean).join(' · ')}
                </div>
              </div>
              <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full shrink-0 ${matchStyle(j.match)}`}>
                {j.match}% match
              </span>
            </div>

            {j.skills.length > 0 && (
              <div className='flex flex-wrap gap-1.5 mt-3.5'>
                {j.skills.map((s) => (
                  <span
                    key={s.name}
                    className={`text-[11px] font-mono px-2.5 py-1 rounded-full ${
                      s.matched ? 'bg-[#E4EAE6] text-[#5C7A6E]' : 'bg-[#F2E0DC] text-[#A6503E]'
                    }`}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>

      {jobs.length > 0 && (
        <p className='text-[11.5px] text-[#3C4A5E] mt-4 leading-relaxed'>
          Green tags are skills you have, red tags are skills you are missing. Match combines skills (70%), title
          similarity (15%) and seniority fit (15%).
        </p>
      )}
    </div>
  )
}

export default Recommendation