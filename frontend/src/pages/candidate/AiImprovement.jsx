import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'

const card = 'bg-white border border-[#DBDCD3] rounded-md p-6'
const sectionTitle = 'text-[10.5px] font-mono uppercase tracking-wide text-[#C98A3E] mb-3'
const btnPrimary =
  'cursor-pointer bg-[#C98A3E] hover:bg-[#B67B33] rounded py-1.5 px-3 text-xs text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
const btnGhost =
  'cursor-pointer border border-[#DBDCD3] hover:border-[#0F1A2B] rounded py-1.5 px-3 text-xs text-[#0F1A2B] transition-colors'

const Entry = ({ title, text, state }) => (
  <div className='mb-4'>
    <div className='text-[13px] font-semibold text-[#0F1A2B]'>{title}</div>
    <p
      className={`mt-1.5 text-[13px] leading-relaxed text-[#2B333F] px-2.5 py-1.5 rounded-sm whitespace-pre-line ${
        state === 'weak'
          ? 'bg-[#F2E0DC]/60 border-l-2 border-[#A6503E]'
          : state === 'improved'
          ? 'bg-[#E4EAE6] border-l-2 border-[#5C7A6E]'
          : ''
      }`}
    >
      {text || <span className='text-[#3C4A5E]'>No description yet</span>}
    </p>
  </div>
)

const AiImprovement = () => {
  const [resume, setResume] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [baseScore, setBaseScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(null)
  const [dismissed, setDismissed] = useState(() => new Set())
  const [drafts, setDrafts] = useState({})
  const [improved, setImproved] = useState(() => new Set())

  useEffect(() => {
    ;(async () => {
      try {
        const d = await api('/resumes')
        const r = d.resumes[0]
        if (!r) return
        const a = await api(`/resumes/${r._id}/analyze`, { method: 'POST' })
        setResume(a.resume)
        setSuggestions(a.suggestions)
        setBaseScore(a.resume.ats.score)
      } catch (e) {
        setError(e.message || 'Could not load suggestions')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const apply = async (id, value) => {
    setBusy(id)
    setError('')
    try {
      const d = await api(`/resumes/${resume._id}/apply`, { method: 'POST', body: { id, value } })
      setResume(d.resume)
      setSuggestions(d.suggestions)
      if (id.startsWith('weak:')) {
        setImproved((s) => new Set(s).add(id.replace('weak:', '')))
        setDrafts(({ [id]: _drop, ...rest }) => rest)
      }
    } catch (e) {
      setError(e.message || 'Could not apply this suggestion')
    } finally {
      setBusy(null)
    }
  }

  const dismiss = (id) => setDismissed((s) => new Set(s).add(id))

  if (loading) return <div className='p-5 text-sm text-[#3C4A5E]'>Analyzing your resume…</div>

  if (!resume) {
    return (
      <div className='p-5'>
        <h1 className='text-2xl font-serif font-bold text-[#0F1A2B] mb-2'>AI improvement</h1>
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

  const score = resume.ats?.score ?? 0
  const delta = baseScore == null ? 0 : score - baseScore
  const visible = suggestions.filter((s) => !dismissed.has(s.id))
  const weakKeys = new Set(visible.filter((s) => s.type === 'bullet').map((s) => s.id.replace('weak:', '')))
  const stateOf = (key) => (weakKeys.has(key) ? 'weak' : improved.has(key) ? 'improved' : null)

  return (
    <div className='p-5'>
      <div className='flex justify-between items-center mb-5 border-b border-[#DBDCD3] pb-5'>
        <div>
          <h1 className='text-2xl font-serif font-bold text-[#0F1A2B]'>AI improvement</h1>
          <p className='text-sm text-[#3C4A5E]/70 mt-1'>Apply suggestions and watch your score update live</p>
        </div>
        <div className='flex gap-2.5'>
          <Link to='/candidate/builder' className={btnGhost}>Open builder</Link>
          <Link to='/candidate/score' className={btnGhost}>Full report</Link>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5 items-start'>

        {/* left: resume content */}
        <div className={card}>
          <div className={sectionTitle}>Experience</div>
          {resume.experience.map((e, i) =>
            e.role || e.company ? (
              <Entry
                key={`exp-${i}`}
                title={[e.company, e.role].filter(Boolean).join(' · ')}
                text={e.description}
                state={stateOf(`exp:${i}`)}
              />
            ) : null
          )}

          {resume.projects.some((p) => p.name) && (
            <>
              <div className={`${sectionTitle} mt-6`}>Projects</div>
              {resume.projects.map((p, i) =>
                p.name ? (
                  <Entry key={`proj-${i}`} title={p.name} text={p.description} state={stateOf(`proj:${i}`)} />
                ) : null
              )}
            </>
          )}

          {resume.skills.length > 0 && (
            <>
              <div className={`${sectionTitle} mt-6`}>Skills</div>
              <div className='flex flex-wrap gap-2'>
                {resume.skills.map((s) => (
                  <span key={s} className='text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#E4EAE6] text-[#5C7A6E]'>{s}</span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* right: score + suggestions */}
        <div>
          <div className='flex items-center justify-between pb-4 mb-4 border-b border-[#DBDCD3]'>
            <span className='text-xs text-[#3C4A5E]'>Live score</span>
            <span className='flex items-baseline gap-2'>
              <span className='font-mono text-2xl font-semibold text-[#5C7A6E]'>
                {score}<span className='text-xs text-[#3C4A5E]'> /100</span>
              </span>
              {delta !== 0 && (
                <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${delta > 0 ? 'bg-[#E4EAE6] text-[#5C7A6E]' : 'bg-[#F2E0DC] text-[#A6503E]'}`}>
                  {delta > 0 ? '+' : ''}{delta}
                </span>
              )}
            </span>
          </div>

          {error && <p className='text-sm text-[#A6503E] mb-3'>{error}</p>}

          {visible.length === 0 && (
            <div className={card}>
              <p className='text-sm text-[#3C4A5E]'>No suggestions right now. Nice work.</p>
            </div>
          )}

          <div className='flex flex-col gap-3.5'>
            {visible.map((s) => {
              const draft = drafts[s.id] ?? s.current
              return (
                <div key={s.id} className='bg-white border border-[#DBDCD3] rounded-md p-4'>
                  <div className='font-mono text-[10.5px] uppercase tracking-wide text-[#A6503E] mb-2'>
                    {s.title}{s.label ? ` · ${s.label}` : ''}
                  </div>

                  {s.type === 'keyword' && (
                    <>
                      <p className='text-[12.5px] text-[#0F1A2B] leading-relaxed mb-3'>{s.text}</p>
                      <div className='flex flex-wrap gap-2 mb-3'>
                        {s.keywords.map((k) => (
                          <button
                            key={k}
                            disabled={busy === s.id}
                            onClick={() => apply('keywords', k)}
                            className='text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#F2E0DC] text-[#A6503E] hover:bg-[#E4EAE6] hover:text-[#5C7A6E] transition-colors disabled:opacity-50'
                          >
                            + {k}
                          </button>
                        ))}
                      </div>
                      <button onClick={() => dismiss(s.id)} className={btnGhost}>Dismiss</button>
                    </>
                  )}

                  {s.type === 'bullet' && (
                    <>
                      <ul className='list-disc pl-4 text-[12.5px] text-[#0F1A2B] leading-relaxed mb-3'>
                        {s.reasons.map((r) => <li key={r}>{r}</li>)}
                      </ul>
                      <textarea
                        value={draft}
                        onChange={(e) => setDrafts((d) => ({ ...d, [s.id]: e.target.value }))}
                        placeholder='Describe what you did and the result, e.g. "Built a scheduling tool used by 3 clinics, cutting no-shows by 20%."'
                        className='w-full min-h-[90px] resize-y px-3 py-2 border border-[#DBDCD3] rounded-[5px] text-[12.5px] text-[#0F1A2B] bg-[#EEF0EC] focus:outline-none focus:border-[#C98A3E] mb-3'
                      />
                      <div className='flex gap-2'>
                        <button
                          disabled={busy === s.id || !draft.trim() || draft.trim() === (s.current || '').trim()}
                          onClick={() => apply(s.id, draft)}
                          className={btnPrimary}
                        >
                          {busy === s.id ? 'Saving…' : 'Apply'}
                        </button>
                        <button onClick={() => dismiss(s.id)} className={btnGhost}>Dismiss</button>
                      </div>
                    </>
                  )}

                  {s.type === 'format' && (
                    <>
                      <p className='text-[12.5px] text-[#0F1A2B] leading-relaxed mb-3'>{s.text}</p>
                      <div className='flex gap-2'>
                        <button disabled={busy === s.id} onClick={() => apply(s.id)} className={btnPrimary}>
                          {busy === s.id ? 'Fixing…' : 'Fix'}
                        </button>
                        <button onClick={() => dismiss(s.id)} className={btnGhost}>Dismiss</button>
                      </div>
                    </>
                  )}

                  {s.type === 'info' && (
                    <>
                      <p className='text-[12.5px] text-[#0F1A2B] leading-relaxed mb-3'>{s.text}</p>
                      <div className='flex gap-2'>
                        <Link to='/candidate/builder' className={btnPrimary}>Open builder</Link>
                        <button onClick={() => dismiss(s.id)} className={btnGhost}>Dismiss</button>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AiImprovement