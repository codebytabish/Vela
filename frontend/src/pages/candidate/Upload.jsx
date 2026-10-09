import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'

const card = 'bg-white border border-[#DBDCD3] rounded-md p-6'
const sectionTitle = 'text-[10.5px] font-mono uppercase tracking-wide text-[#C98A3E] mb-1.5'
const MAX = 5 * 1024 * 1024

const Field = ({ label, value }) => (
  <div className='flex justify-between gap-4 py-2 border-b border-[#DBDCD3] last:border-b-0 text-[13px]'>
    <span className='font-mono text-[11px] uppercase tracking-wide text-[#3C4A5E] shrink-0 pt-0.5'>{label}</span>
    <span className={`text-right break-words min-w-0 ${value ? 'text-[#0F1A2B]' : 'text-[#A6503E]'}`}>
      {value || 'Not found'}
    </span>
  </div>
)

const Upload = () => {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [phase, setPhase] = useState('idle') // idle | uploading | done | error
  const [error, setError] = useState('')
  const [result, setResult] = useState(null) // { resume, warnings }

  const reset = () => {
    setFile(null); setPhase('idle'); setError(''); setResult(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleFile = async (f) => {
    if (!f) return
    if (!/\.(pdf|docx)$/i.test(f.name)) {
      setFile(f); setPhase('error'); setError('Only PDF or DOCX files are supported.'); return
    }
    if (f.size > MAX) {
      setFile(f); setPhase('error'); setError('File is larger than 5MB.'); return
    }

    setFile(f); setPhase('uploading'); setError(''); setResult(null)
    try {
      const fd = new FormData()
      fd.append('file', f)
      const d = await api('/resumes/upload', { method: 'POST', body: fd })
      setResult(d)
      setPhase('done')
    } catch (err) {
      setError(err?.message || 'Upload failed')
      setPhase('error')
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  const r = result?.resume
  const b = r?.basics || {}

  return (
    <div className='p-5'>
      <div className='mb-5 border-b border-[#DBDCD3] pb-5'>
        <h1 className='text-2xl font-serif font-bold text-[#0F1A2B]'>Upload &amp; parse</h1>
        <p className='text-sm text-[#3C4A5E]/70 mt-1'>Vela reads your file and extracts structured fields</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-5 items-start'>

        {/* left: dropzone */}
        <div className={card}>
          <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Resume file</h3>

          <div
            onClick={() => phase !== 'uploading' && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`cursor-pointer text-center rounded-md border-2 border-dashed px-6 py-12 transition-colors ${
              dragging ? 'border-[#C98A3E] bg-[#F5E7D2]/40' : 'border-[#DBDCD3] hover:border-[#C98A3E]'
            }`}
          >
            <div className='mx-auto mb-3 w-10 h-10 rounded-full border border-[#DBDCD3] flex items-center justify-center text-[#C98A3E]'>↑</div>
            <div className='text-sm font-semibold text-[#0F1A2B]'>Click or drag a file here</div>
            <div className='text-xs text-[#3C4A5E] mt-1'>PDF or DOCX, up to 5MB</div>
            <input
              ref={inputRef}
              type='file'
              accept='.pdf,.docx'
              className='hidden'
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          {file && (
            <div className='mt-4 flex items-center justify-between gap-3 text-[12.5px] border border-[#DBDCD3] rounded px-3 py-2'>
              <span className='truncate text-[#0F1A2B]'>📄 {file.name}</span>
              <span className='font-mono text-[11px] text-[#3C4A5E] shrink-0'>{(file.size / 1024).toFixed(0)} KB</span>
            </div>
          )}
        </div>

        {/* right: parse status */}
        <div className={card}>
          <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Parse status</h3>

          {phase === 'idle' && (
            <p className='text-sm text-[#3C4A5E]'>Upload a resume to see extracted fields here.</p>
          )}

          {phase === 'uploading' && (
            <div className='flex items-center gap-3 text-sm text-[#3C4A5E]'>
              <span className='w-4 h-4 rounded-full border-2 border-[#DBDCD3] border-t-[#C98A3E] animate-spin' />
              Reading your file and extracting fields…
            </div>
          )}

          {phase === 'error' && (
            <div>
              <p className='text-sm text-[#A6503E] mb-4'>{error}</p>
              <button onClick={reset} className='text-sm font-medium text-[#C98A3E]'>Try another file</button>
            </div>
          )}

          {phase === 'done' && r && (
            <div className='flex flex-col gap-5'>
              <div className='text-sm text-[#5C7A6E] font-medium'>✓ Parsed {result.warnings.length ? 'with a few gaps' : 'successfully'}</div>

              <div>
                <Field label='Name' value={b.name} />
                <Field label='Title' value={b.title} />
                <Field label='Email' value={b.email} />
                <Field label='Phone' value={b.phone} />
                <Field label='Location' value={b.location} />
                <Field label='Link' value={b.portfolio} />
              </div>

              <div className='grid grid-cols-4 gap-px bg-[#DBDCD3] border border-[#DBDCD3] rounded overflow-hidden text-center'>
                {[
                  ['Skills', r.skills.length],
                  ['Roles', r.experience.length],
                  ['Education', r.education.length],
                  ['Projects', r.projects.length],
                ].map(([label, n]) => (
                  <div key={label} className='bg-white py-3'>
                    <div className='font-serif text-xl font-semibold text-[#0F1A2B]'>{n}</div>
                    <div className='font-mono text-[10px] uppercase tracking-wide text-[#3C4A5E]'>{label}</div>
                  </div>
                ))}
              </div>

              {b.summary && (
                <div>
                  <div className={sectionTitle}>Summary</div>
                  <p className='text-[13px] text-[#2B333F] leading-relaxed'>{b.summary}</p>
                </div>
              )}

              {r.skills.length > 0 && (
                <div>
                  <div className={sectionTitle}>Skills</div>
                  <div className='flex flex-wrap gap-2'>
                    {r.skills.map((s) => (
                      <span key={s} className='text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#E4EAE6] text-[#5C7A6E]'>{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {r.experience.length > 0 && (
                <div>
                  <div className={sectionTitle}>Experience</div>
                  {r.experience.map((e, i) => (
                    <div key={i} className='text-[13px] text-[#2B333F] mb-1'>
                      <strong>{e.role || 'Role?'}</strong>{e.company && `, ${e.company}`}{' '}
                      <span className='font-mono text-[11px] text-[#3C4A5E]'>{e.dates}</span>
                    </div>
                  ))}
                </div>
              )}

              {r.education.length > 0 && (
                <div>
                  <div className={sectionTitle}>Education</div>
                  {r.education.map((e, i) => (
                    <div key={i} className='text-[13px] text-[#2B333F] mb-1'>
                      <strong>{e.school || 'School?'}</strong>{e.degree && ` — ${e.degree}`}{' '}
                      <span className='font-mono text-[11px] text-[#3C4A5E]'>{e.dates}</span>
                    </div>
                  ))}
                </div>
              )}

              {r.projects.length > 0 && (
                <div>
                  <div className={sectionTitle}>Projects</div>
                  {r.projects.map((p, i) => (
                    <div key={i} className='text-[13px] text-[#2B333F] mb-1'>
                      <strong>{p.name}</strong>
                      {p.tech && <span className='font-mono text-[11px] text-[#3C4A5E]'> · {p.tech}</span>}
                    </div>
                  ))}
                </div>
              )}

              {result.warnings.length > 0 && (
                <div className='border border-[#F5E7D2] bg-[#F5E7D2]/40 rounded p-3'>
                  <div className='text-xs font-semibold text-[#8A5D22] mb-1.5'>Check these in the builder</div>
                  <ul className='list-disc pl-5 text-[12.5px] text-[#8A5D22] flex flex-col gap-1'>
                    {result.warnings.map((w) => <li key={w}>{w}</li>)}
                  </ul>
                </div>
              )}

              <p className='text-xs text-[#3C4A5E]'>
                Parsing is automatic and can miss things. Review and fix the fields in the builder.
              </p>

              <div className='flex gap-2.5'>
                <button
                  onClick={() => navigate('/candidate/builder')}
                  className='cursor-pointer bg-[#C98A3E] hover:bg-[#B67B33] rounded py-2 px-3.5 text-sm text-white font-medium transition-colors'
                >
                  Review &amp; edit in Builder →
                </button>
                <button
                  onClick={reset}
                  className='cursor-pointer border border-[#DBDCD3] hover:border-[#0F1A2B] rounded py-2 px-3.5 text-sm text-[#0F1A2B] transition-colors'
                >
                  Upload another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Upload