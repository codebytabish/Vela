import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'

const card = 'bg-white border border-[#DBDCD3] rounded-md p-6'
const sectionTitle = 'font-serif text-base font-semibold text-[#0F1A2B] mb-4'

const LEVEL = {
  Expert: { fill: '#5C7A6E', text: '#FFFFFF', chip: 'bg-[#5C7A6E] text-white' },
  Advanced: { fill: '#A9BDB3', text: '#0F1A2B', chip: 'bg-[#E4EAE6] text-[#5C7A6E]' },
  Intermediate: { fill: '#E6C48F', text: '#0F1A2B', chip: 'bg-[#F5E7D2] text-[#8A5D22]' },
  Emerging: { fill: '#EEF0EC', text: '#0F1A2B', chip: 'bg-[#EEF0EC] text-[#3C4A5E] border border-[#DBDCD3]' },
}

const short = (s, n = 12) => (s.length > n ? `${s.slice(0, n - 1)}…` : s)

const Graph = ({ skills }) => {
  const nodes = skills.slice(0, 8)
  const cx = 230
  const cy = 160
  const pos = (i) => {
    const a = -Math.PI / 2 + (i / nodes.length) * Math.PI * 2
    return { x: cx + 170 * Math.cos(a), y: cy + 108 * Math.sin(a) }
  }

  return (
    <svg viewBox='0 0 460 320' className='w-full h-auto'>
      {nodes.map((s, i) => {
        const { x, y } = pos(i)
        return <line key={`l-${s.name}`} x1={cx} y1={cy} x2={x} y2={y} stroke='#DBDCD3' strokeWidth='1.5' />
      })}

      <circle cx={cx} cy={cy} r='30' fill='#0F1A2B' />
      <text x={cx} y={cy + 4} textAnchor='middle' fontSize='13' fontWeight='600' fill='#FFFFFF'>You</text>

      {nodes.map((s, i) => {
        const { x, y } = pos(i)
        const r = 11 + (s.score / 100) * 9
        const style = LEVEL[s.level]
        return (
          <g key={s.name}>
            <title>{`${s.name}: ${s.level}`}</title>
            <circle cx={x} cy={y} r={r} fill={style.fill} stroke='#5C7A6E' strokeWidth='1' />
            <text x={x} y={y + r + 14} textAnchor='middle' fontSize='11' fill='#0F1A2B'>{short(s.name)}</text>
          </g>
        )
      })}
    </svg>
  )
}

const evidenceText = (e) => {
  const parts = []
  if (e.mentions) parts.push(`${e.mentions} mention${e.mentions === 1 ? '' : 's'}`)
  if (e.roles) parts.push(`${e.roles} role${e.roles === 1 ? '' : 's'}`)
  if (e.projects) parts.push(`${e.projects} project${e.projects === 1 ? '' : 's'}`)
  if (e.years) parts.push(`~${e.years} yr`)
  return parts.length ? parts.join(' · ') : 'Listed only, no evidence in your experience yet'
}

const SkillsGraph = () => {
  const [resumeId, setResumeId] = useState(null)
  const [graph, setGraph] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const d = await api('/resumes')
        const r = d.resumes[0]
        if (!r) return
        setResumeId(r._id)
        const g = await api(`/resumes/${r._id}/skills-graph`)
        setGraph(g.graph)
      } catch (e) {
        setError(e.message || 'Could not load your skills')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const add = async (name) => {
    setBusy(name)
    setError('')
    try {
      const d = await api(`/resumes/${resumeId}/skills`, { method: 'POST', body: { name } })
      setGraph(d.graph)
    } catch (e) {
      setError(e.message || 'Could not add this skill')
    } finally {
      setBusy(null)
    }
  }

  if (loading) return <div className='p-5 text-sm text-[#3C4A5E]'>Building your skills graph…</div>

  if (!resumeId) {
    return (
      <div className='p-5'>
        <h1 className='text-2xl font-serif font-bold text-[#0F1A2B] mb-2'>Skills graph</h1>
        <div className={card}>
          <p className='text-sm text-[#3C4A5E] mb-4'>You need a resume first.</p>
          <div className='flex gap-4'>
            <Link to='/candidate/builder' className='text-sm font-semibold text-[#C98A3E]'>Build one →</Link>
            <Link to='/candidate/upload' className='text-sm font-semibold text-[#C98A3E]'>Upload one →</Link>
          </div>
        </div>
      </div>
    )
  }

  const skills = graph?.skills || []
  const suggested = graph?.suggested || []

  return (
    <div className='p-5'>
      <div className='mb-5 border-b border-[#DBDCD3] pb-5'>
        <h1 className='text-2xl font-serif font-bold text-[#0F1A2B]'>Skills graph</h1>
        <p className='text-sm text-[#3C4A5E]/70 mt-1'>Extracted automatically from your experience, no manual tagging</p>
      </div>

      {error && <p className='text-sm text-[#A6503E] mb-3'>{error}</p>}

      {skills.length === 0 ? (
        <div className={card}>
          <p className='text-sm text-[#3C4A5E] mb-4'>
            No skills found yet. Add skills or describe your work in the builder and they will appear here.
          </p>
          <Link to='/candidate/builder' className='text-sm font-semibold text-[#C98A3E]'>Open builder →</Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5 items-start'>

          {/* left: graph */}
          <div className={card}>
            <Graph skills={skills} />
            <div className='flex flex-wrap gap-2 mt-3'>
              {Object.keys(LEVEL).map((l) => (
                <span key={l} className={`text-[11px] font-mono px-2.5 py-1 rounded-full ${LEVEL[l].chip}`}>{l}</span>
              ))}
            </div>
            <p className='text-xs text-[#3C4A5E] mt-3 leading-relaxed'>
              Strength is inferred from the evidence in your resume: how often and in how many roles and projects a skill
              appears. It is not a test of your ability.
            </p>
          </div>

          {/* right: strength + suggestions */}
          <div className='flex flex-col gap-5'>
            <div className={card}>
              <h3 className={sectionTitle}>Skill strength</h3>
              <div className='flex flex-col gap-4'>
                {skills.slice(0, 10).map((s) => (
                  <div key={s.name}>
                    <div className='flex items-center justify-between gap-3'>
                      <span className='text-[13px] font-semibold text-[#0F1A2B]'>{s.name}</span>
                      <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full ${LEVEL[s.level].chip}`}>{s.level}</span>
                    </div>
                    <div className='h-1.5 bg-[#DBDCD3] rounded-full overflow-hidden mt-1.5'>
                      <div className='h-full rounded-full bg-[#5C7A6E]' style={{ width: `${s.score}%` }} />
                    </div>
                    <div className='text-[11px] text-[#3C4A5E] mt-1'>{evidenceText(s.evidence)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={card}>
              <h3 className={sectionTitle}>Suggested to add</h3>
              {suggested.length === 0 ? (
                <p className='text-sm text-[#3C4A5E]'>No suggestions right now.</p>
              ) : (
                <>
                  <div className='flex flex-col'>
                    {suggested.map((s, i) => (
                      <div
                        key={s.name}
                        className={`flex items-center justify-between gap-3 py-3 ${i !== suggested.length - 1 ? 'border-b border-[#DBDCD3]' : ''}`}
                      >
                        <div>
                          <div className='text-[13px] font-semibold text-[#0F1A2B]'>{s.name}</div>
                          <div className='text-[11.5px] text-[#3C4A5E] mt-0.5'>{s.reason}</div>
                        </div>
                        <button
                          disabled={busy === s.name}
                          onClick={() => add(s.name)}
                          className='shrink-0 cursor-pointer border border-[#DBDCD3] hover:border-[#0F1A2B] rounded py-1.5 px-3 text-xs text-[#0F1A2B] transition-colors disabled:opacity-50'
                        >
                          {busy === s.name ? 'Adding…' : 'Add'}
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className='text-[11.5px] text-[#3C4A5E] mt-3'>Only add skills you actually have.</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SkillsGraph