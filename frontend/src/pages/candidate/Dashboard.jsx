import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../lib/api'

const card = 'bg-white border border-[#DBDCD3] rounded-md p-6'
const sectionTitle = 'text-[10.5px] font-mono uppercase tracking-wide text-[#C98A3E] mb-1.5'
const verdict = (s) => (s >= 80 ? 'Strong match' : s >= 60 ? 'Good match' : 'Needs work')

const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

const timeAgo = (d) => {
  const m = Math.floor((Date.now() - new Date(d)) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} h ago`
  return `${Math.floor(h / 24)} d ago`
}

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    api('/resumes')
      .then((d) => setResume(d.resumes[0] || null))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const b = resume?.basics || {}
  const ats = resume?.ats
  const experience = (resume?.experience || []).filter((e) => e.role || e.company)
  const projects = (resume?.projects || []).filter((p) => p.name)
  const skills = resume?.skills || []

  const completeness = [
    { label: 'Profile & summary', done: !!(b.name && b.title && b.summary) },
    { label: 'Experience', done: experience.length > 0 },
    { label: 'Education', done: !!resume?.education?.some((e) => e.school) },
    { label: 'Skills', done: skills.length > 0 },
    { label: 'Portfolio projects', done: projects.length > 0 },
  ]
  const strength = Math.round((completeness.filter((c) => c.done).length / completeness.length) * 100)

  const stats = [
    { label: 'ATS score', value: ats ? ats.score : '—', note: ats ? verdict(ats.score) : 'Run Save & score' },
    { label: 'Profile strength', value: `${strength}%` },
    { label: 'Skills listed', value: skills.length },
    { label: 'Projects', value: projects.length },
  ]

  const activity = [
    ats?.scoredAt && {
      time: ats.scoredAt,
      node: <>Scored <strong className='font-semibold'>{ats.score}/100</strong>{ats.jobTitle && <> for {ats.jobTitle}</>}</>,
    },
    resume?.updatedAt && {
      time: resume.updatedAt,
      node: <>Resume <strong className='font-semibold'>{resume.title}</strong> saved</>,
    },
  ]
    .filter(Boolean)
    .sort((a, c) => new Date(c.time) - new Date(a.time))

  const steps = [
    { n: 1, title: 'Build your resume', text: 'Fill in your profile, experience, education, skills and projects.' },
    { n: 2, title: 'Add a target job', text: 'Paste the job description you are applying for.' },
    { n: 3, title: 'Save & score', text: 'Get your ATS score and a list of what to fix.' },
  ]

  if (loading) return <div className='p-5 text-sm text-[#3C4A5E]'>Loading…</div>

  return (
    <div className='p-5'>

      {/* header */}
      <div className='flex justify-between items-center mb-5 border-[#DBDCD3] border-b pb-5'>
        <div>
          {/* 
    split(' ')[0] keeps just the first name, e.g. "Hanan Ahmad" -> "Hanan". */}
<h1 className='text-2xl font-medium text-[#0F1A2B]'>{greeting()}, {user?.name?.split(' ')[0]}</h1>
          <p className='text-sm text-[#3C4A5E]/70 mt-1'>
            {resume ? "Here's where your search stands today" : "Let's get your resume set up"}
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Link
            to='/candidate/search'
            className='cursor-pointer border rounded py-2 px-3 text-sm text-white bg-[#C98A3E] hover:bg-[#B67B33] transition-colors'
          >
            Find Roles
          </Link>
          <button
            onClick={handleLogout}
            className='px-3 py-2 rounded text-sm border border-[#DBDCD3] text-[#0F1A2B] hover:bg-[#EEF0EC] cursor-pointer'
          >
            Log out
          </button>
        </div>
      </div>

      {/* stats */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-px bg-[#DBDCD3] border border-[#DBDCD3] rounded-md overflow-hidden mb-5'>
        {stats.map((s) => (
          <div key={s.label} className='bg-white p-5'>
            <div className='text-[10.5px] font-mono uppercase tracking-wide text-[#3C4A5E] mb-2.5'>{s.label}</div>
            <div className='font-serif text-2xl font-semibold text-[#0F1A2B]'>{s.value}</div>
            {s.note && <div className='text-[11.5px] text-[#5C7A6E] mt-1.5'>{s.note}</div>}
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5'>

        {/* left column */}
        <div className='flex flex-col gap-5'>

          {/* your resume / get started */}
          <div className={card}>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='font-serif text-base font-semibold text-[#0F1A2B]'>
                {resume ? 'Your resume' : 'Get started'}
              </h3>
              {resume && (
                <Link to='/candidate/builder' className='text-xs font-semibold text-[#C98A3E]'>Edit →</Link>
              )}
            </div>

            {!resume ? (
              <>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5'>
                  {steps.map((s) => (
                    <div key={s.n} className='border border-[#DBDCD3] rounded-md p-4'>
                      <div className='font-mono text-xs text-[#C98A3E] mb-2'>0{s.n}</div>
                      <div className='font-semibold text-sm text-[#0F1A2B] mb-1'>{s.title}</div>
                      <p className='text-xs text-[#3C4A5E] leading-relaxed'>{s.text}</p>
                    </div>
                  ))}
                </div>
                <Link
                  to='/candidate/builder'
                  className='inline-block bg-[#C98A3E] hover:bg-[#B67B33] rounded py-2 px-4 text-sm text-white font-medium transition-colors'
                >
                  Build my resume →
                </Link>
              </>
            ) : (
              <div className='flex flex-col gap-4 text-[13px] text-[#2B333F]'>
                <div>
                  <div className='font-semibold text-sm text-[#0F1A2B]'>{b.name}</div>
                  <div className='text-xs text-[#3C4A5E] mt-1'>{[b.title, b.location].filter(Boolean).join(' · ')}</div>
                  {b.summary && <p className='mt-2 leading-relaxed'>{b.summary}</p>}
                </div>

                {experience.length > 0 && (
                  <div>
                    <div className={sectionTitle}>Experience</div>
                    {experience.map((e, i) => (
                      <div key={i} className='mb-1'>
                        <strong>{e.role}</strong>{e.company && `, ${e.company}`}{' '}
                        <span className='font-mono text-[11px] text-[#3C4A5E]'>{e.dates}</span>
                      </div>
                    ))}
                  </div>
                )}

                {projects.length > 0 && (
                  <div>
                    <div className={sectionTitle}>Projects</div>
                    {projects.map((p, i) => (
                      <div key={i} className='mb-1'>
                        <strong>{p.name}</strong>
                        {p.tech && <span className='font-mono text-[11px] text-[#3C4A5E]'> · {p.tech}</span>}
                      </div>
                    ))}
                  </div>
                )}

                {skills.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {skills.map((s) => (
                      <span key={s} className='text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#E4EAE6] text-[#5C7A6E]'>{s}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* next steps (only once a resume exists) */}
          {resume && (
            <div className={card}>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='font-serif text-base font-semibold text-[#0F1A2B]'>Next steps</h3>
                {ats && <Link to='/candidate/score' className='text-xs font-semibold text-[#C98A3E]'>Full report →</Link>}
              </div>

              {!ats ? (
                <p className='text-sm text-[#3C4A5E]'>
                  Open the builder, add a target job, and click <strong>Save &amp; score</strong> to see what to fix.
                </p>
              ) : (
                <>
                  <ul className='flex flex-col gap-2 text-[13px] text-[#2B333F] list-disc pl-5'>
                    {ats.tips.map((t, i) => <li key={i}>{t}</li>)}
                    {!ats.tips.length && <li>Nothing flagged. Nice work.</li>}
                  </ul>
                  {ats.missing?.length > 0 && (
                    <div className='flex flex-wrap gap-2 mt-4'>
                      {ats.missing.map((k) => (
                        <span key={k} className='text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#F2E0DC] text-[#A6503E]'>{k}</span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* recent activity */}
          <div className={card}>
            <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Recent Activity</h3>
            {activity.length === 0 && (
              <p className='text-sm text-[#3C4A5E]'>Nothing yet. Save your resume to get started.</p>
            )}
            {activity.map((a, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 py-3 ${i !== activity.length - 1 ? 'border-b border-[#DBDCD3]' : ''}`}
              >
                <div className='w-2 h-2 rounded-full bg-[#C98A3E] mt-1.5 shrink-0' />
                <div>
                  <p className='text-[12.5px] text-[#0F1A2B] leading-relaxed'>{a.node}</p>
                  <div className='text-[11px] font-mono text-[#3C4A5E] mt-1'>{timeAgo(a.time)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* right column */}
        <div>
          <div className={card}>
            <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Profile Strength</h3>
            <div className='flex items-center gap-3 mb-4'>
              <svg width='80' height='80'>
                <circle cx='40' cy='40' r='34' fill='none' stroke='#DBDCD3' strokeWidth='7' />
                <circle
                  cx='40' cy='40' r='34' fill='none' stroke='#5C7A6E' strokeWidth='7'
                  strokeDasharray='214' strokeDashoffset={214 * (1 - strength / 100)} strokeLinecap='round'
                  transform='rotate(-90 40 40)'
                />
              </svg>
              <span className='font-serif text-2xl font-semibold text-[#0F1A2B]'>{strength}%</span>
            </div>
            <div className='flex flex-col gap-2'>
              {completeness.map((c) => (
                <div key={c.label} className='flex items-center gap-2 text-[12.5px]'>
                  <span className={`w-3.5 h-3.5 rounded-full border-[1.5px] shrink-0 ${c.done ? 'bg-[#5C7A6E] border-[#5C7A6E]' : 'border-[#DBDCD3]'}`} />
                  <span className={c.done ? 'text-[#0F1A2B]' : 'text-[#3C4A5E]'}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`${card} mt-5`}>
            <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Upcoming</h3>
            <p className='text-sm text-[#3C4A5E]'>
              No interviews scheduled yet. They will appear here once you apply to roles.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard