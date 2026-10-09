import { VERBS } from './atsScore.js'

const words = (t) => (t || '').trim().split(/\s+/).filter(Boolean)
const isEmpty = (x) => Object.values(x).every((v) => !String(v || '').trim())

export function buildSuggestions(r, ats) {
  const out = []

  // 1. missing keywords (from the ATS result), minus anything already in skills
  const have = new Set((r.skills || []).map((s) => s.toLowerCase()))
  const missing = (ats?.missing || []).filter((k) => !have.has(k.toLowerCase()))
  if (missing.length) {
    out.push({
      id: 'keywords',
      type: 'keyword',
      title: 'Missing keywords',
      text: 'These appear in the job description but not in your resume. Add only the ones that are true for you.',
      keywords: missing,
    })
  }

  // 2. weak descriptions (experience + projects)
  const entries = [
    ...(r.experience || []).map((e, i) => ({
      key: `exp:${i}`, ok: !!(e.role || e.company),
      label: [e.role, e.company].filter(Boolean).join(' · '), text: e.description || '',
    })),
    ...(r.projects || []).map((p, i) => ({
      key: `proj:${i}`, ok: !!p.name, label: p.name, text: p.description || '',
    })),
  ].filter((e) => e.ok)

  const bullets = []
  for (const en of entries) {
    const t = en.text.trim()
    const reasons = []
    if (!t) reasons.push('No description yet')
    else {
      if (!/\d/.test(t)) reasons.push('No numbers. Add scale or results (users, %, time saved)')
      if (!VERBS.test(t)) reasons.push('Does not start with an action verb (Led, Built, Reduced…)')
    }
    if (reasons.length) {
      bullets.push({ id: `weak:${en.key}`, type: 'bullet', title: 'Weak description', label: en.label, current: en.text, reasons })
    }
  }
  out.push(...bullets.slice(0, 5))

  // 3. formatting
  const dates = [...(r.experience || []), ...(r.education || [])].map((e) => e.dates || '').join(' ')
  if (new Set(dates.match(/[-–—]/g) || []).size > 1) {
    out.push({ id: 'dates', type: 'format', title: 'Formatting', text: 'Date ranges use different dash styles. Standardize them to one style (–).' })
  }
  const empties = [...(r.experience || []), ...(r.education || []), ...(r.projects || [])].filter(isEmpty).length
  if (empties) {
    out.push({ id: 'empty', type: 'format', title: 'Formatting', text: `Remove ${empties} empty entr${empties === 1 ? 'y' : 'ies'}.` })
  }

  // 4. tips that need you in the builder
  if (words(r.basics?.summary).length < 20)
    out.push({ id: 'info:summary', type: 'info', title: 'Summary', text: 'Write a 20–70 word summary at the top of your resume.' })
  if ((r.skills || []).length < 5)
    out.push({ id: 'info:skills', type: 'info', title: 'Skills', text: 'List at least 5 skills you actually use.' })
  if (!(r.projects || []).some((p) => p.name))
    out.push({ id: 'info:projects', type: 'info', title: 'Projects', text: 'Add at least one project with what you built and the tech used.' })
  if (!r.target?.jobDescription?.trim())
    out.push({ id: 'info:target', type: 'info', title: 'Target job', text: 'Paste a job description in the Target job tab to unlock keyword matching.' })

  return out
}

// mutates the plain resume object `r`; returns false if the request is invalid
export function applySuggestion(r, id, value) {
  if (id === 'keywords') {
    const kw = String(value || '').trim()
    if (!kw || kw.length > 40) return false
    r.skills = r.skills || []
    if (!r.skills.some((s) => s.toLowerCase() === kw.toLowerCase())) r.skills.push(kw)
    return true
  }

  if (id === 'dates') {
    const fix = (e) => ({ ...e, dates: (e.dates || '').replace(/\s*[-–—]\s*/g, '–') })
    r.experience = (r.experience || []).map(fix)
    r.education = (r.education || []).map(fix)
    return true
  }

  if (id === 'empty') {
    const keep = (x) => !isEmpty(x)
    r.experience = (r.experience || []).filter(keep)
    r.education = (r.education || []).filter(keep)
    r.projects = (r.projects || []).filter(keep)
    return true
  }

  const m = id.match(/^weak:(exp|proj):(\d+)$/)
  if (m) {
    const text = String(value || '').trim()
    if (!text || text.length > 2000) return false
    const list = m[1] === 'exp' ? r.experience : r.projects
    const item = list?.[Number(m[2])]
    if (!item) return false
    item.description = text
    return true
  }

  return false
}