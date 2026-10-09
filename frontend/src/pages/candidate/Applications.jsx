/**
 * pages/candidate/Applications.jsx
 * --------------------------------
 * The candidate's application tracker, shown as a board with four columns:
 * Applied | Interviewing | Offer | Closed.
 *
 * Data flow:
 *   - On load, GET /applications returns all my applications (one request).
 *   - The board is built in the browser by grouping them by `status`.
 *   - Add / edit / delete call the API, then update the list in memory (no page reload).
 *
 * `editing` says which form is open:
 *   null   -> none
 *   'new'  -> the "Add application" form at the top
 *   <id>   -> the card with that id is replaced by an edit form
 */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'

// ---------- styling shortcuts ----------
const card = 'bg-white border border-[#DBDCD3] rounded-md p-4'
const inputClass =
  'w-full px-3 py-2 border border-[#DBDCD3] rounded-[5px] text-[13px] text-[#0F1A2B] bg-[#EEF0EC] focus:outline-none focus:border-[#C98A3E] transition-colors'
const labelClass = 'block text-[10.5px] font-mono uppercase tracking-wide text-[#3C4A5E] mb-1'
const btnPrimary =
  'cursor-pointer bg-[#C98A3E] hover:bg-[#B67B33] rounded py-1.5 px-3 text-xs text-white font-medium transition-colors disabled:opacity-60'
const btnGhost =
  'cursor-pointer border border-[#DBDCD3] hover:border-[#0F1A2B] rounded py-1.5 px-3 text-xs text-[#0F1A2B] transition-colors'

// ---------- constants ----------
// The board columns, in order.
const COLUMNS = [
  { id: 'applied', label: 'Applied' },
  { id: 'interviewing', label: 'Interviewing' },
  { id: 'offer', label: 'Offer' },
  { id: 'closed', label: 'Closed' },
]
const REASONS = { rejected: 'Rejected', declined: 'Declined', withdrawn: 'Withdrawn' }
// What the single date field in the form means for each status.
const DATE_LABEL = { applied: 'Date applied', interviewing: 'Interview date', offer: 'Offer date', closed: 'Closed on' }

// ---------- small helpers ----------
// "Jul 30" (adds the year only if it is not the current year)
const fmt = (d) => {
  if (!d) return ''
  const date = new Date(d)
  const opts = { month: 'short', day: 'numeric' }
  if (date.getFullYear() !== new Date().getFullYear()) opts.year = 'numeric'
  return date.toLocaleDateString('en-US', opts)
}

// Date -> "YYYY-MM-DD" for <input type="date">
const toDay = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '')
const today = () => new Date().toISOString().slice(0, 10)

// Which stored date matches the application's current status.
const dateOfStatus = (a) =>
  a.status === 'applied' ? a.appliedAt : a.status === 'interviewing' ? a.interviewAt : a.statusAt

// The small line on each card, e.g. "Applied Jul 30" or "Interview Aug 4".
const dateLine = (a) => {
  if (a.status === 'applied') return `Applied ${fmt(a.appliedAt)}`
  if (a.status === 'interviewing') {
    return a.interviewAt ? `Interview ${fmt(a.interviewAt)}` : `Interviewing since ${fmt(a.statusAt)}`
  }
  if (a.status === 'offer') return `Offer received ${fmt(a.statusAt)}`
  return `${REASONS[a.closedReason] || 'Closed'} ${fmt(a.statusAt)}`
}

// Order inside a column: interviews by soonest date first, everything else newest first.
const sortColumn = (list, status) =>
  [...list].sort((a, b) => {
    if (status === 'interviewing') {
      const A = a.interviewAt ? new Date(a.interviewAt) : Infinity
      const B = b.interviewAt ? new Date(b.interviewAt) : Infinity
      return A - B
    }
    return new Date(b.statusAt) - new Date(a.statusAt)
  })

// Empty form for "Add application".
const blankForm = () => ({ title: '', company: '', status: 'applied', date: today(), reason: 'withdrawn', note: '' })

const Applications = () => {
  const [apps, setApps] = useState([])          // all my applications
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)  // see the note at the top of the file
  const [form, setForm] = useState(blankForm())
  const [saving, setSaving] = useState(false)

  // Load everything once when the page opens.
  useEffect(() => {
    api('/applications')
      .then((d) => setApps(d.applications))
      .catch((e) => setError(e.message || 'Could not load your applications'))
      .finally(() => setLoading(false))
  }, [])

  // setField('title') returns an onChange handler that updates that one form field.
  const setField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const openNew = () => { setForm(blankForm()); setEditing('new'); setError('') }

  // Fill the form with an existing application's values.
  const openEdit = (a) => {
    setForm({
      title: a.title,
      company: a.company,
      status: a.status,
      date: toDay(dateOfStatus(a)),
      reason: a.closedReason || 'withdrawn',
      note: a.note || '',
    })
    setEditing(a._id)
    setError('')
  }

  const close = () => { setEditing(null); setForm(blankForm()); setError('') }

  // Create (editing === 'new') or update (editing === an id).
  const save = async () => {
    const current = apps.find((a) => a._id === editing)
    const linked = !!current?.jobId // linked to a Vela job: title/company are fixed

    if (!linked && (!form.title.trim() || !form.company.trim())) {
      setError('Title and company are required')
      return
    }

    setSaving(true)
    setError('')
    try {
      const body = { status: form.status, date: form.date, closedReason: form.reason, note: form.note }
      if (!linked) { body.title = form.title; body.company = form.company }

      if (editing === 'new') {
        const d = await api('/applications', { method: 'POST', body })
        setApps((list) => [d.application, ...list])
      } else {
        const d = await api(`/applications/${editing}`, { method: 'PATCH', body })
        setApps((list) => list.map((a) => (a._id === editing ? d.application : a)))
      }
      close()
    } catch (e) {
      setError(e.message || 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (a) => {
    if (!window.confirm(`Delete "${a.title}" at ${a.company}?`)) return
    try {
      await api(`/applications/${a._id}`, { method: 'DELETE' })
      setApps((list) => list.filter((x) => x._id !== a._id))
      if (editing === a._id) close()
    } catch (e) {
      setError(e.message || 'Could not delete')
    }
  }

  // The add/edit form. `app` is undefined when adding a new one.
  // (Called as a function, not used as a component, so inputs keep focus while typing.)
  const renderForm = (app) => {
    const linked = !!app?.jobId
    return (
      <div className={`${card} border-[#C98A3E]`}>
        {/* Vela jobs: title and company are read-only. Manual ones: editable inputs. */}
        {linked ? (
          <div className='mb-3'>
            <div className='text-[13.5px] font-semibold text-[#0F1A2B]'>{app.title}</div>
            <div className='text-xs text-[#3C4A5E] mt-0.5'>{app.company}</div>
          </div>
        ) : (
          <div className='flex flex-col gap-3 mb-3'>
            <div>
              <label className={labelClass}>Job title</label>
              <input className={inputClass} value={form.title} onChange={setField('title')} placeholder='Product Designer' autoFocus />
            </div>
            <div>
              <label className={labelClass}>Company</label>
              <input className={inputClass} value={form.company} onChange={setField('company')} placeholder='Fable Systems' />
            </div>
          </div>
        )}

        <div className='grid grid-cols-2 gap-3 mb-3'>
          <div>
            <label className={labelClass}>Status</label>
            <select
              className={inputClass}
              value={form.status}
              // When the status changes, reset the date to today (the old date meant something else).
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value, date: today() }))}
            >
              {COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>{DATE_LABEL[form.status]}</label>
            <input type='date' className={inputClass} value={form.date} onChange={setField('date')} />
          </div>
        </div>

        {/* Only closed applications need a reason. */}
        {form.status === 'closed' && (
          <div className='mb-3'>
            <label className={labelClass}>Reason</label>
            <select className={inputClass} value={form.reason} onChange={setField('reason')}>
              {Object.entries(REASONS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
          </div>
        )}

        <div className='mb-3'>
          <label className={labelClass}>Note (optional)</label>
          <textarea
            className={`${inputClass} min-h-[60px] resize-y`}
            value={form.note}
            onChange={setField('note')}
            placeholder='Recruiter name, next step, salary discussed…'
          />
        </div>

        <div className='flex gap-2'>
          <button onClick={save} disabled={saving} className={btnPrimary}>
            {saving ? 'Saving…' : app ? 'Save changes' : 'Add application'}
          </button>
          <button onClick={close} className={btnGhost}>Cancel</button>
        </div>
      </div>
    )
  }

  if (loading) return <div className='p-5 text-sm text-[#3C4A5E]'>Loading your applications…</div>

  const active = apps.filter((a) => a.status !== 'closed').length

  return (
    <div className='p-5'>
      {/* ---------- header ---------- */}
      <div className='flex justify-between items-center mb-5 border-b border-[#DBDCD3] pb-5'>
        <div>
          <h1 className='text-2xl font-serif font-bold text-[#0F1A2B]'>Applications</h1>
          <p className='text-sm text-[#3C4A5E]/70 mt-1'>
            {active} active · {apps.length - active} closed · move cards between columns as things progress
          </p>
        </div>
        <button onClick={openNew} disabled={editing === 'new'} className={btnPrimary}>+ Add application</button>
      </div>

      {error && <p className='text-sm text-[#A6503E] mb-3'>{error}</p>}

      {/* "Add application" form, shown above the board */}
      {editing === 'new' && <div className='mb-5 max-w-md'>{renderForm()}</div>}

      {/* Nothing yet: explain how to get started */}
      {apps.length === 0 && editing !== 'new' && (
        <div className={`${card} mb-5`}>
          <p className='text-sm text-[#3C4A5E] mb-3'>
            No applications yet. Apply from a role page, or add one you made elsewhere.
          </p>
          <div className='flex gap-4'>
            <Link to='/candidate/search' className='text-sm font-semibold text-[#C98A3E]'>Find roles →</Link>
            <button onClick={openNew} className='text-sm font-semibold text-[#C98A3E]'>+ Add application</button>
          </div>
        </div>
      )}

      {/* ---------- the board ---------- */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start'>
        {COLUMNS.map((col) => {
          const items = sortColumn(apps.filter((a) => a.status === col.id), col.id)
          return (
            <div key={col.id}>
              {/* column header with the count */}
              <div className='flex items-center justify-between mb-3'>
                <h2 className='font-serif text-base font-semibold text-[#0F1A2B]'>{col.label}</h2>
                <span className='font-mono text-xs text-[#3C4A5E]'>{items.length}</span>
              </div>

              <div className='flex flex-col gap-3'>
                {items.length === 0 && (
                  <div className='border border-dashed border-[#DBDCD3] rounded-md p-4 text-xs text-[#3C4A5E]'>Nothing here</div>
                )}

                {items.map((a) =>
                  editing === a._id ? (
                    // This card is being edited: show the form in its place.
                    <div key={a._id}>{renderForm(a)}</div>
                  ) : (
                    <div key={a._id} className={`${card} ${col.id === 'closed' ? 'opacity-80' : ''}`}>
                      <div className='flex justify-between items-start gap-2'>
                        <div className='min-w-0'>
                          <div className='text-[13.5px] font-semibold text-[#0F1A2B]'>{a.title}</div>
                          <div className='text-xs text-[#3C4A5E] mt-0.5'>{a.company}</div>
                        </div>
                        <button
                          onClick={() => remove(a)}
                          aria-label='Delete'
                          className='text-lg leading-none text-[#3C4A5E] hover:text-[#A6503E] shrink-0'
                        >
                          ×
                        </button>
                      </div>

                      <div className='font-mono text-[11px] text-[#5C7A6E] mt-2.5'>{dateLine(a)}</div>
                      {a.note && <p className='text-xs text-[#2B333F] mt-2 leading-relaxed whitespace-pre-line'>{a.note}</p>}

                      <div className='flex items-center gap-3 mt-3'>
                        <button onClick={() => openEdit(a)} className='text-xs font-semibold text-[#C98A3E] hover:underline'>Edit</button>
                        {/* Only applications made through Vela link back to the job */}
                        {a.jobId && (
                          <Link to={`/candidate/detail?job=${a.jobId}`} className='text-xs font-semibold text-[#C98A3E] hover:underline'>
                            View job →
                          </Link>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Applications