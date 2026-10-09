import React, { useEffect, useState } from 'react'
import { api } from '../../lib/api'

const card = 'bg-white border border-[#DBDCD3] rounded-md p-5'
const inputClass =
  'w-full px-3 py-2.5 border border-[#DBDCD3] rounded-[5px] text-[13.5px] text-[#0F1A2B] bg-[#EEF0EC] focus:outline-none focus:border-[#C98A3E] transition-colors'
const labelClass = 'block text-[11.5px] font-mono uppercase tracking-wide text-[#3C4A5E] mb-1.5'
const btnPrimary =
  'cursor-pointer bg-[#C98A3E] hover:bg-[#B67B33] rounded py-2 px-3.5 text-sm text-white font-medium transition-colors disabled:opacity-60'
const btnGhost =
  'cursor-pointer border border-[#DBDCD3] hover:border-[#0F1A2B] rounded py-2 px-3.5 text-sm text-[#0F1A2B] transition-colors'

const EMPTY = { title: '', description: '', tag: '', link: '' }

const Portfolio = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | item id
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api('/portfolio')
      .then((d) => setItems(d.items))
      .catch((e) => setError(e.message || 'Could not load your portfolio'))
      .finally(() => setLoading(false))
  }, [])

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const openNew = () => { setForm(EMPTY); setEditing('new'); setError('') }
  const openEdit = (it) => {
    setForm({ title: it.title, description: it.description || '', tag: it.tag || '', link: it.link || '' })
    setEditing(it._id)
    setError('')
  }
  const close = () => { setEditing(null); setForm(EMPTY); setError('') }

  const save = async () => {
    if (!form.title.trim()) { setError('Title is required'); return }
    setSaving(true)
    setError('')
    try {
      if (editing === 'new') {
        const d = await api('/portfolio', { method: 'POST', body: form })
        setItems((list) => [...list, d.item])
      } else {
        const d = await api(`/portfolio/${editing}`, { method: 'PUT', body: form })
        setItems((list) => list.map((i) => (i._id === editing ? d.item : i)))
      }
      setEditing(null)
      setForm(EMPTY)
    } catch (e) {
      setError(e.message || 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (it) => {
    if (!window.confirm(`Delete "${it.title}"?`)) return
    try {
      await api(`/portfolio/${it._id}`, { method: 'DELETE' })
      setItems((list) => list.filter((i) => i._id !== it._id))
      if (editing === it._id) close()
    } catch (e) {
      setError(e.message || 'Could not delete')
    }
  }

  const renderForm = () => (
    <div className={`${card} border-[#C98A3E]`}>
      <div className='mb-3.5'>
        <label className={labelClass}>Title</label>
        <input className={inputClass} value={form.title} onChange={set('title')} placeholder='Scheduling platform redesign' autoFocus />
      </div>
      <div className='mb-3.5'>
        <label className={labelClass}>Description</label>
        <textarea
          className={`${inputClass} min-h-[90px] resize-y`}
          value={form.description}
          onChange={set('description')}
          placeholder='What you built, your role, and the result (numbers help)'
        />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4'>
        <div>
          <label className={labelClass}>Tag</label>
          <input className={inputClass} value={form.tag} onChange={set('tag')} placeholder='Healthcare' />
        </div>
        <div>
          <label className={labelClass}>Link (optional)</label>
          <input className={inputClass} value={form.link} onChange={set('link')} placeholder='github.com/you/project' />
        </div>
      </div>
      <div className='flex gap-2.5'>
        <button onClick={save} disabled={saving} className={btnPrimary}>
          {saving ? 'Saving…' : editing === 'new' ? 'Add case study' : 'Save changes'}
        </button>
        <button onClick={close} className={btnGhost}>Cancel</button>
      </div>
    </div>
  )

  if (loading) return <div className='p-5 text-sm text-[#3C4A5E]'>Loading your portfolio…</div>

  return (
    <div className='p-5'>
      <div className='flex justify-between items-center mb-5 border-b border-[#DBDCD3] pb-5'>
        <div>
          <h1 className='text-2xl font-serif font-bold text-[#0F1A2B]'>Portfolio</h1>
          <p className='text-sm text-[#3C4A5E]/70 mt-1'>Case studies recruiters see alongside your resume</p>
        </div>
        <button onClick={openNew} disabled={editing === 'new'} className={btnPrimary}>+ Add project</button>
      </div>

      {error && editing === null && <p className='text-sm text-[#A6503E] mb-3'>{error}</p>}
      {error && editing !== null && <p className='text-sm text-[#A6503E] mb-3'>{error}</p>}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {items.map((it) =>
          editing === it._id ? (
            <div key={it._id}>{renderForm()}</div>
          ) : (
            <div key={it._id} className={card}>
              <div className='flex justify-between items-start gap-3 mb-2'>
                <h3 className='font-serif text-base font-semibold text-[#0F1A2B]'>{it.title}</h3>
                <div className='flex items-center gap-3 shrink-0'>
                  <button onClick={() => openEdit(it)} className='text-xs font-semibold text-[#C98A3E] hover:underline'>Edit</button>
                  <button onClick={() => remove(it)} aria-label='Delete' className='text-lg leading-none text-[#3C4A5E] hover:text-[#A6503E]'>×</button>
                </div>
              </div>
              {it.description && (
                <p className='text-[13px] text-[#2B333F] leading-relaxed whitespace-pre-line mb-3'>{it.description}</p>
              )}
              <div className='flex items-center gap-3'>
                {it.tag && (
                  <span className='text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#E4EAE6] text-[#5C7A6E]'>{it.tag}</span>
                )}
                {it.link && (
                  <a href={it.link} target='_blank' rel='noopener noreferrer' className='text-xs font-semibold text-[#C98A3E] hover:underline'>
                    View →
                  </a>
                )}
              </div>
            </div>
          )
        )}

        {editing === 'new' ? (
          renderForm()
        ) : (
          <button
            onClick={openNew}
            className='cursor-pointer border-2 border-dashed border-[#DBDCD3] hover:border-[#C98A3E] rounded-md p-5 min-h-[120px] text-sm font-medium text-[#3C4A5E] hover:text-[#C98A3E] transition-colors'
          >
            + Add a case study
          </button>
        )}
      </div>

      {items.length === 0 && editing !== 'new' && (
        <p className='text-sm text-[#3C4A5E] mt-4'>
          No case studies yet. Add 2 or 3 projects you are proud of, with what you built and the result.
        </p>
      )}
    </div>
  )
}

export default Portfolio