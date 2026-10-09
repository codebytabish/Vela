import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'

const tabs = ['Profile', 'Experience', 'Education', 'Skills', 'Target job']
const uid = () => crypto.randomUUID()

const emptyResume = () => ({
  title: 'My Resume',
  basics: { name: '', title: '', location: '', email: '', portfolio: '', summary: '' },
  experience: [{ id: uid(), company: '', role: '', dates: '', description: '' }],
  education: [{ id: uid(), school: '', degree: '', dates: '' }],
  skills: [{ id: uid(), name: '' }],
  projects: [],
  target: { jobTitle: '', company: '', jobDescription: '' },
})

const Builder = () => {
  const [activeTab, setActiveTab] = useState('Profile')
  const [resume, setResume] = useState(emptyResume)
  const [resumeId, setResumeId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null) // { type: 'ok' | 'error', text }

  const navigate = useNavigate()

  useEffect(() => {
    api('/resumes')
      .then((d) => {
        const r = d.resumes[0]
        if (!r) return
        const blank = emptyResume()
        const exp = r.experience || []
        const edu = r.education || []
        const skills = r.skills || []
        setResumeId(r._id)
        setResume({
          title: r.title || blank.title,
          basics: { ...blank.basics, ...r.basics },
          experience: exp.length ? exp.map((e) => ({ ...e, id: uid() })) : blank.experience,
          education: edu.length ? edu.map((e) => ({ ...e, id: uid() })) : blank.education,
          skills: skills.length ? skills.map((name) => ({ id: uid(), name })) : blank.skills,
          projects: (r.projects || []).map((p) => ({ ...p, id: uid() })),
          target: { ...blank.target, ...r.target },
        })
      })
      .catch(console.error)
  }, [])

  // returns the resume id on success, null on failure
  const save = async () => {
    setSaving(true)
    setStatus(null)
    try {
      const body = {
        title: resume.title,
        basics: resume.basics,
        experience: resume.experience.map(({ id, ...rest }) => rest),
        education: resume.education.map(({ id, ...rest }) => rest),
        projects: resume.projects.map(({ id, ...rest }) => rest),
        skills: resume.skills.map((s) => s.name.trim()).filter(Boolean),
        target: resume.target,
      }
      const d = resumeId
        ? await api(`/resumes/${resumeId}`, { method: 'PUT', body })
        : await api('/resumes', { method: 'POST', body })
      setResumeId(d.resume._id)
      setStatus({ type: 'ok', text: 'Saved ✓' })
      return d.resume._id
    } catch (err) {
      console.error('Save failed:', err)
      setStatus({ type: 'error', text: err?.message || 'Save failed' })
      return null
    } finally {
      setSaving(false)
    }
  }

  const saveAndScore = async () => {
    const id = await save()
    if (!id) return
    setSaving(true)
    setStatus({ type: 'ok', text: 'Scoring…' })
    try {
      await api(`/resumes/${id}/score`, { method: 'POST' })
      navigate('/candidate/score')
    } catch (err) {
      console.error('Score failed:', err)
      setStatus({ type: 'error', text: err?.message || 'Scoring failed' })
    } finally {
      setSaving(false)
    }
  }

  const updateList = (key, id, field) => (e) =>
    setResume((r) => ({ ...r, [key]: r[key].map((i) => (i.id === id ? { ...i, [field]: e.target.value } : i)) }))
  const addItem = (key, blank) => setResume((r) => ({ ...r, [key]: [...r[key], { id: uid(), ...blank }] }))
  const removeItem = (key, id) => setResume((r) => ({ ...r, [key]: r[key].filter((i) => i.id !== id) }))

  const experienceList = resume.experience
  const education = resume.education
  const skillsList = resume.skills
  const projects = resume.projects
  const formData = resume.basics
  const set = (field) => (e) => setResume((r) => ({ ...r, basics: { ...r.basics, [field]: e.target.value } }))
  const setTarget = (field) => (e) =>
    setResume((r) => ({ ...r, target: { ...r.target, [field]: e.target.value } }))

  const inputClass = "w-full px-3 py-2.5 border border-[#DBDCD3] rounded-[5px] text-[13.5px] text-[#0F1A2B] bg-[#EEF0EC] focus:outline-none focus:border-[#C98A3E] transition-colors"
  const labelClass = "block text-[11.5px] font-mono uppercase tracking-wide text-[#3C4A5E] mb-1.5"
  const sectionClass = "text-[10.5px] font-mono uppercase tracking-wide text-[#C98A3E] mt-5 mb-2"

  return (
    <div className='p-5'>
      <div className='flex justify-between items-center mb-5 border-b border-[#DBDCD3] pb-5 print:hidden'>
        <div>
          <h1 className='text-2xl font-serif font-bold text-[#0F1A2B]'>Resume builder</h1>
          <p className='text-sm text-[#3C4A5E]/70 mt-1'>Editing "{resume.title}"</p>
        </div>
        <div className='flex items-center gap-2.5'>
          {status && (
            <span className={`text-xs ${status.type === 'ok' ? 'text-[#5C7A6E]' : 'text-[#A6503E]'}`}>
              {status.text}
            </span>
          )}
          <button
            onClick={save}
            disabled={saving}
            className='cursor-pointer border border-[#DBDCD3] hover:border-[#0F1A2B] rounded py-2 px-3.5 text-sm text-[#0F1A2B] transition-colors disabled:opacity-60'
          >
            {saving ? 'Saving…' : 'Save draft'}
          </button>
          <button
            onClick={saveAndScore}
            disabled={saving}
            className='cursor-pointer bg-[#C98A3E] hover:bg-[#B67B33] rounded py-2 px-3.5 text-sm text-white font-medium transition-colors disabled:opacity-60'
          >
            Save & score
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* left: form */}
        <div className='print:hidden'>
          <div className='flex gap-1.5 mb-4 flex-wrap'>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs px-3.5 py-2 rounded-full border transition-colors ${
                  activeTab === tab
                    ? 'bg-[#0F1A2B] text-white border-[#0F1A2B]'
                    : 'border-[#DBDCD3] text-[#3C4A5E] hover:border-[#0F1A2B]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
            {activeTab === 'Profile' && (
              <>
                <div className='mb-4'>
                  <label className={labelClass}>Full name</label>
                  <input className={inputClass} value={formData.name} onChange={set('name')} />
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4'>
                  <div>
                    <label className={labelClass}>Title</label>
                    <input className={inputClass} value={formData.title} onChange={set('title')} />
                  </div>
                  <div>
                    <label className={labelClass}>Location</label>
                    <input className={inputClass} value={formData.location} onChange={set('location')} />
                  </div>
                </div>
                <div className='mb-4'>
                  <label className={labelClass}>Summary</label>
                  <textarea className={`${inputClass} min-h-[90px] resize-y`} value={formData.summary} onChange={set('summary')} />
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5'>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input className={inputClass} value={formData.email} onChange={set('email')} />
                  </div>
                  <div>
                    <label className={labelClass}>Portfolio URL</label>
                    <input className={inputClass} value={formData.portfolio} onChange={set('portfolio')} />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Experience' && (
              <div className='flex flex-col gap-5'>
                {experienceList.map((exp, i) => (
                  <div key={exp.id} className={i !== 0 ? 'pt-5 border-t border-[#DBDCD3]' : ''}>
                    <div className='flex justify-between items-center mb-3'>
                      <span className='text-[11px] font-mono text-[#3C4A5E] uppercase tracking-wide'>Role {i + 1}</span>
                      {experienceList.length > 1 && (
                        <button onClick={() => removeItem('experience', exp.id)} className='text-[11px] text-[#A6503E] hover:underline'>
                          Remove
                        </button>
                      )}
                    </div>
                    <div className='mb-3.5'>
                      <label className={labelClass}>Company</label>
                      <input className={inputClass} value={exp.company} onChange={updateList('experience', exp.id, 'company')} placeholder='Vantage Labs' />
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5'>
                      <div>
                        <label className={labelClass}>Role</label>
                        <input className={inputClass} value={exp.role} onChange={updateList('experience', exp.id, 'role')} placeholder='Senior Product Designer' />
                      </div>
                      <div>
                        <label className={labelClass}>Dates</label>
                        <input className={inputClass} value={exp.dates} onChange={updateList('experience', exp.id, 'dates')} placeholder='2022–Present' />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Description</label>
                      <textarea
                        className={`${inputClass} min-h-[70px] resize-y`}
                        value={exp.description}
                        onChange={updateList('experience', exp.id, 'description')}
                        placeholder='Led end-to-end product design for...'
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addItem('experience', { company: '', role: '', dates: '', description: '' })}
                  className='text-sm font-medium text-[#C98A3E] hover:text-[#B67B33] text-left'
                >
                  + Add another role
                </button>

                {/* ---------- Projects ---------- */}
                <div className='pt-5 border-t border-[#DBDCD3]'>
                  <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Projects</h3>
                  <div className='flex flex-col gap-5'>
                    {projects.map((p, i) => (
                      <div key={p.id} className={i !== 0 ? 'pt-5 border-t border-[#DBDCD3]' : ''}>
                        <div className='flex justify-between items-center mb-3'>
                          <span className='text-[11px] font-mono text-[#3C4A5E] uppercase tracking-wide'>Project {i + 1}</span>
                          <button onClick={() => removeItem('projects', p.id)} className='text-[11px] text-[#A6503E] hover:underline'>
                            Remove
                          </button>
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5'>
                          <div>
                            <label className={labelClass}>Project name</label>
                            <input className={inputClass} value={p.name} onChange={updateList('projects', p.id, 'name')} placeholder='Vela' />
                          </div>
                          <div>
                            <label className={labelClass}>Link</label>
                            <input className={inputClass} value={p.link} onChange={updateList('projects', p.id, 'link')} placeholder='github.com/you/vela' />
                          </div>
                        </div>
                        <div className='mb-3.5'>
                          <label className={labelClass}>Tech used</label>
                          <input className={inputClass} value={p.tech} onChange={updateList('projects', p.id, 'tech')} placeholder='React, Node.js, MongoDB' />
                        </div>
                        <div>
                          <label className={labelClass}>Description</label>
                          <textarea
                            className={`${inputClass} min-h-[70px] resize-y`}
                            value={p.description}
                            onChange={updateList('projects', p.id, 'description')}
                            placeholder='What it does and what you built...'
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => addItem('projects', { name: '', link: '', tech: '', description: '' })}
                      className='text-sm font-medium text-[#C98A3E] hover:text-[#B67B33] text-left'
                    >
                      + Add a project
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Education' && (
              <div className='flex flex-col gap-5'>
                {education.map((edu, i) => (
                  <div key={edu.id} className={i !== 0 ? 'pt-5 border-t border-[#DBDCD3]' : ''}>
                    <div className='flex justify-between items-center mb-3'>
                      <span className='text-[11px] font-mono text-[#3C4A5E] uppercase tracking-wide'>School {i + 1}</span>
                      {education.length > 1 && (
                        <button onClick={() => removeItem('education', edu.id)} className='text-[11px] text-[#A6503E] hover:underline'>
                          Remove
                        </button>
                      )}
                    </div>
                    <div className='mb-3.5'>
                      <label className={labelClass}>School</label>
                      <input className={inputClass} value={edu.school} onChange={updateList('education', edu.id, 'school')} placeholder='UC Davis' />
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5'>
                      <div>
                        <label className={labelClass}>Degree</label>
                        <input className={inputClass} value={edu.degree} onChange={updateList('education', edu.id, 'degree')} placeholder='B.A. Design' />
                      </div>
                      <div>
                        <label className={labelClass}>Dates</label>
                        <input className={inputClass} value={edu.dates} onChange={updateList('education', edu.id, 'dates')} placeholder='2015–2019' />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addItem('education', { school: '', degree: '', dates: '' })}
                  className='text-sm font-medium text-[#C98A3E] hover:text-[#B67B33] text-left'
                >
                  + Add another school
                </button>
              </div>
            )}

            {activeTab === 'Skills' && (
              <div className='flex flex-col gap-3'>
                {skillsList.map((skill) => (
                  <div key={skill.id} className='flex items-center gap-2.5'>
                    <input
                      className={inputClass}
                      value={skill.name}
                      onChange={updateList('skills', skill.id, 'name')}
                      placeholder='e.g. Figma'
                    />
                    {skillsList.length > 1 && (
                      <button onClick={() => removeItem('skills', skill.id)} className='text-[11px] text-[#A6503E] hover:underline shrink-0'>
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addItem('skills', { name: '' })}
                  className='text-sm font-medium text-[#C98A3E] hover:text-[#B67B33] text-left mt-1'
                >
                  + Add another skill
                </button>
              </div>
            )}

            {activeTab === 'Target job' && (
              <div className='flex flex-col gap-4'>
                <p className='text-[12.5px] text-[#3C4A5E] leading-relaxed'>
                  Paste the job you're applying for. Save &amp; score compares your resume against it.
                </p>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5'>
                  <div>
                    <label className={labelClass}>Job title</label>
                    <input className={inputClass} value={resume.target.jobTitle} onChange={setTarget('jobTitle')} placeholder='Senior Product Designer' />
                  </div>
                  <div>
                    <label className={labelClass}>Company</label>
                    <input className={inputClass} value={resume.target.company} onChange={setTarget('company')} placeholder='Northwind Health' />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Job description</label>
                  <textarea
                    className={`${inputClass} min-h-[200px] resize-y`}
                    value={resume.target.jobDescription}
                    onChange={setTarget('jobDescription')}
                    placeholder='Paste the full job description here...'
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* right: live preview */}
        <div id='resume-preview' className='bg-white border border-[#DBDCD3] rounded-md p-8 lg:sticky lg:top-5 h-fit'>
          <div className='flex justify-between'>
            <h2 className='font-serif text-xl font-semibold text-[#0F1A2B]'>{formData.name}</h2>
            <button
              onClick={() => window.print()}
              className='print:hidden border border-[#DBDCD3] cursor-pointer text-white bg-[#C98A3E] hover:bg-[#B67B33] rounded py-1.5 px-3 text-xs transition-colors shrink-0'
            >
              Download PDF
            </button>
          </div>
          <p className='text-[12.5px] text-[#3C4A5E] mb-1'>
            {[formData.title, formData.location].filter(Boolean).join(' · ')}
          </p>
          <p className='text-[12px] text-[#3C4A5E] mb-4'>
            {[formData.email, formData.portfolio].filter(Boolean).join(' · ')}
          </p>
          {formData.summary && <p className='text-[13px] text-[#2B333F] leading-relaxed'>{formData.summary}</p>}

          <div className={sectionClass}>Experience</div>
          {experienceList.map((e) => (
            <div key={e.id} className='mb-3'>
              <div className='text-[13px] font-semibold text-[#0F1A2B]'>
                {e.role}{e.company && `, ${e.company}`}
              </div>
              <div className='text-[11.5px] font-mono text-[#3C4A5E]'>{e.dates}</div>
              <p className='text-[13px] text-[#2B333F] leading-relaxed'>{e.description}</p>
            </div>
          ))}

          {projects.length > 0 && (
            <>
              <div className={sectionClass}>Projects</div>
              {projects.map((p) => (
                <div key={p.id} className='mb-3'>
                  <div className='text-[13px] font-semibold text-[#0F1A2B]'>
                    {p.name}{p.link && <span className='font-normal text-[11.5px] text-[#3C4A5E]'> · {p.link}</span>}
                  </div>
                  {p.tech && <div className='text-[11.5px] font-mono text-[#3C4A5E]'>{p.tech}</div>}
                  <p className='text-[13px] text-[#2B333F] leading-relaxed'>{p.description}</p>
                </div>
              ))}
            </>
          )}

          <div className={sectionClass}>Education</div>
          {education.map((e) => (
            <div key={e.id} className='text-[13px] text-[#2B333F] mb-1'>
              <strong>{e.school}</strong> {e.degree && `— ${e.degree}`}{' '}
              <span className='font-mono text-[11.5px]'>{e.dates}</span>
            </div>
          ))}

          <div className={sectionClass}>Skills</div>
          <p className='text-[13px] text-[#2B333F]'>
            {skillsList.map((s) => s.name).filter(Boolean).join(' · ')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Builder