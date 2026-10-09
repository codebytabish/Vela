/**
 * pages/candidate/JobDetail.jsx
 * -----------------------------
 * Shows ONE job. Which job comes from the URL:  /candidate/detail?job=<job id>
 *
 * Three states:
 *   - no ?job= in the URL -> show my top matches so I can pick one
 *   - ?job=<id>           -> load that job, my match score, and "why it's a match"
 *   - job not found       -> friendly message with a way back
 *
 * Two actions:
 *   - Apply                               -> saves an application (shows up on the Applications page)
 *   - Check my resume against this job    -> sets the job as my resume's target, opens the ATS report
 */
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../../lib/api'

const card = 'bg-white border border-[#DBDCD3] rounded-md p-6'
const sectionTitle = 'font-serif text-base font-semibold text-[#0F1A2B] mb-3'
const WORK = { remote: 'Remote', hybrid: 'Hybrid', onsite: 'On-site' }
const LEVEL = { intern: 'Intern', junior: 'Junior', mid: 'Mid', senior: 'Senior', staff: 'Staff', lead: 'Lead' }

// Color of the big match number: green >= 90, amber 75-89, red below 75.
const matchStyle = (m) => (m >= 90 ? 'text-[#5C7A6E]' : m >= 75 ? 'text-[#8A5D22]' : 'text-[#A6503E]')

const JobDetail = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const jobId = params.get('job') // null when the page was opened from the sidebar

  const [job, setJob] = useState(null)
  const [picks, setPicks] = useState([])          // top matches, only used when no job is selected
  const [hasResume, setHasResume] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false) // "Check my resume" in progress
  const [applied, setApplied] = useState(false)   // have I already applied to this job?
  const [applying, setApplying] = useState(false) // "Apply" in progress

  // Load data whenever the job id in the URL changes.
  useEffect(() => {
    setLoading(true)
    setJob(null)
    setError('')

    // No job selected: load my best matches so I can pick one.
    if (!jobId) {
      api('/jobs/recommendations')
        .then((d) => setPicks(d.jobs.slice(0, 6)))
        .catch((e) => setError(e.message || 'Could not load roles'))
        .finally(() => setLoading(false))
      return
    }

    // A job is selected: load it.
    api(`/jobs/${jobId}`)
      .then((d) => {
        setHasResume(d.hasResume)
        setJob(d.job)
        setApplied(!!d.applied)
      })
      .catch((e) => setError(e.message || 'Could not load this job'))
      .finally(() => setLoading(false))
  }, [jobId])

  // Make this job the resume's target, score it, then open the ATS report.
  const check = async () => {
    setChecking(true)
    setError('')
    try {
      await api(`/jobs/${jobId}/score`, { method: 'POST' })
      navigate('/candidate/score')
    } catch (e) {
      setError(e.message || 'Could not score your resume')
      setChecking(false)
    }
  }

  // Record an application for this job.
  const apply = async () => {
    setApplying(true)
    setError('')
    try {
      await api('/applications', { method: 'POST', body: { jobId } })
      setApplied(true)
    } catch (e) {
      // The server answers "You already applied" when a record exists: treat that as applied too.
      if (/already/i.test(e.message || '')) setApplied(true)
      else setError(e.message || 'Could not apply')
    } finally {
      setApplying(false)
    }
  }

  const back = (
    <Link to='/candidate/search' className='text-sm font-semibold text-[#C98A3E] hover:underline'>← Back to results</Link>
  )

  if (loading) return <div className='p-5 text-sm text-[#3C4A5E]'>Loading role…</div>

  // ---------- state 1: no job selected -> pick one ----------
  if (!jobId) {
    return (
      <div className='p-5'>
        <div className='flex justify-between items-center mb-5 border-b border-[#DBDCD3] pb-5'>
          <div>
            <h1 className='text-2xl font-serif font-bold text-[#0F1A2B]'>Job detail</h1>
            <p className='text-sm text-[#3C4A5E]/70 mt-1'>Choose a role to see how you match</p>
          </div>
          {back}
        </div>
        {error && <p className='text-sm text-[#A6503E] mb-3'>{error}</p>}
        <div className={card}>
          <h3 className={sectionTitle}>Your top matches</h3>
          {picks.length === 0 ? (
            <p className='text-sm text-[#3C4A5E]'>No open roles yet, or you have no resume saved.</p>
          ) : (
            picks.map((j, i) => (
              <Link
                key={j.id}
                to={`/candidate/detail?job=${j.id}`}
                className={`flex items-center justify-between gap-4 py-3 hover:bg-[#EEF0EC] -mx-2 px-2 rounded ${
                  i !== picks.length - 1 ? 'border-b border-[#DBDCD3]' : ''
                }`}
              >
                <div>
                  <div className='text-[13.5px] font-semibold text-[#0F1A2B]'>{j.title}</div>
                  <div className='text-xs text-[#3C4A5E] mt-0.5'>{j.company}</div>
                </div>
                <span className='font-mono text-xs text-[#5C7A6E]'>{j.match}% match</span>
              </Link>
            ))
          )}
        </div>
      </div>
    )
  }

  // ---------- state 2: job not found ----------
  if (!job) {
    return (
      <div className='p-5'>
        <h1 className='text-2xl font-serif font-bold text-[#0F1A2B] mb-3'>Job detail</h1>
        <div className={card}>
          <p className='text-sm text-[#A6503E] mb-4'>{error || 'This job is no longer available.'}</p>
          {back}
        </div>
      </div>
    )
  }

  // ---------- state 3: show the job ----------
  // One line under the title: "Company · Remote (City) · Senior · $145-170k"
  const meta = [
    job.company,
    (WORK[job.workType] || job.workType) + (job.workType !== 'remote' && job.location ? ` (${job.location})` : ''),
    LEVEL[job.seniority],
    job.salary,
  ].filter(Boolean).join(' · ')

  return (
    <div className='p-5'>
      <div className='flex justify-between items-center mb-5 border-b border-[#DBDCD3] pb-5'>
        <div>
          <h1 className='text-2xl font-serif font-bold text-[#0F1A2B]'>Job detail</h1>
          <p className='text-sm text-[#3C4A5E]/70 mt-1'>{job.title} · {job.company}</p>
        </div>
        {back}
      </div>

      {error && <p className='text-sm text-[#A6503E] mb-3'>{error}</p>}

      <div className='flex flex-col gap-5'>

        {/* ----- header: title, meta line, Apply button, big match number ----- */}
        <div className={`${card} flex items-start justify-between gap-6`}>
          <div>
            <div className='flex items-center gap-2 flex-wrap'>
              <h2 className='font-serif text-xl font-semibold text-[#0F1A2B]'>{job.title}</h2>
              {job.isSample && (
                <span className='font-mono text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border border-[#DBDCD3] text-[#3C4A5E]'>
                  Sample listing
                </span>
              )}
            </div>
            <p className='text-sm text-[#3C4A5E] mt-1.5'>{meta}</p>

            <div className='mt-3'>
              {applied ? (
                <Link to='/candidate/applications' className='text-sm font-semibold text-[#5C7A6E]'>
                  ✓ Applied · View in Applications →
                </Link>
              ) : (
                <button
                  onClick={apply}
                  disabled={applying}
                  className='cursor-pointer bg-[#C98A3E] hover:bg-[#B67B33] rounded py-2 px-4 text-sm text-white font-medium transition-colors disabled:opacity-60'
                >
                  {applying ? 'Applying…' : 'Apply'}
                </button>
              )}
            </div>
          </div>

          {/* match number only exists when I have a resume to compare */}
          {job.match != null && (
            <div className='text-center shrink-0'>
              <div className={`font-mono text-4xl font-semibold ${matchStyle(job.match)}`}>{job.match}</div>
              <div className='font-mono text-[10px] uppercase tracking-wide text-[#3C4A5E]'>Match</div>
            </div>
          )}
        </div>

        {/* ----- about the role ----- */}
        <div className={card}>
          <h3 className={sectionTitle}>About the role</h3>
          <p className='text-[13.5px] text-[#2B333F] leading-relaxed whitespace-pre-line'>
            {job.description || 'No description provided.'}
          </p>
        </div>

        {/* ----- requirements + skill tags (green = I have it, red = missing) ----- */}
        <div className={card}>
          <h3 className={sectionTitle}>Requirements</h3>
          <ul className='list-disc pl-5 flex flex-col gap-1.5 text-[13.5px] text-[#2B333F]'>
            {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
          </ul>

          {/* skills are objects ({ name, matched }) only when I have a resume */}
          {Array.isArray(job.skills) && typeof job.skills[0] === 'object' && (
            <div className='flex flex-wrap gap-1.5 mt-4'>
              {job.skills.map((s) => (
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
        </div>

        {/* ----- why it's a match ----- */}
        <div className={card}>
          <h3 className={sectionTitle}>Why it's a match</h3>
          {!hasResume ? (
            <>
              <p className='text-sm text-[#3C4A5E] mb-3'>Add a resume to see how you match this role.</p>
              <div className='flex gap-4'>
                <Link to='/candidate/builder' className='text-sm font-semibold text-[#C98A3E]'>Build one →</Link>
                <Link to='/candidate/upload' className='text-sm font-semibold text-[#C98A3E]'>Upload one →</Link>
              </div>
            </>
          ) : (
            <>
              <ul className='list-disc pl-5 flex flex-col gap-2 text-[13.5px] text-[#2B333F] leading-relaxed'>
                {job.why.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
              <div className='mt-5 pt-4 border-t border-[#DBDCD3]'>
                <button
                  onClick={check}
                  disabled={checking}
                  className='cursor-pointer border border-[#DBDCD3] hover:border-[#0F1A2B] rounded py-2 px-4 text-sm text-[#0F1A2B] transition-colors disabled:opacity-60'
                >
                  {checking ? 'Scoring…' : 'Check my resume against this job →'}
                </button>
                <p className='text-xs text-[#3C4A5E] mt-2'>
                  This sets the job as your resume's target and opens your ATS report.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobDetail