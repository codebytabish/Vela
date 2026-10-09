import { SKILLS, has } from './atsScore.js'

const MONTH = '(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\\.?'
const DATE_RANGE = new RegExp(
  `(?:${MONTH}\\s+)?(?:19|20)\\d{2}\\s*(?:-|–|—|to)\\s*(?:(?:${MONTH}\\s+)?(?:19|20)\\d{2}|present|current|now|ongoing)`,
  'i'
)
const SINGLE_DATE = new RegExp(`(?:${MONTH}\\s+)?(?:19|20)\\d{2}`, 'i')
const EDU_DATE = /(?:19|20)\d{2}\s*(?:-|–|—|to)\s*(?:(?:19|20)\d{2}|present|current|expected)|(?:19|20)\d{2}/i

const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/
const URL_RE = /(?:https?:\/\/)?(?:www\.)?(?:linkedin\.com|github\.com|gitlab\.com|behance\.net|dribbble\.com)\/[^\s,|)]+|https?:\/\/[^\s,|)]+/i
const BULLET = /^[•·●▪◦■*\-–]\s*/

const HEADINGS = [
  ['summary', /^(professional\s+)?(summary|profile|objective|about(\s+me)?|career\s+objective)$/i],
  ['experience', /^((work|professional|relevant|internship|industry)\s+)?(experience|employment( history)?|work history|internships?)$/i],
  ['education', /^(education(al)?( background| qualifications?)?|academic( background| qualifications?)|qualifications?)$/i],
  ['skills', /^((technical|key|core|professional)\s+)?(skills|competencies)$|^(technologies|tech stack|tools( & technologies)?)$/i],
  ['projects', /^((personal|academic|selected|key|side)\s+)?projects?$/i],
  ['other', /^(certifications?|certificates?|awards?|honou?rs|achievements?|languages?|references?|interests|hobbies|publications?|volunteer(ing)?|extracurricular.*|activities)$/i],
]

const headingOf = (line) => {
  const t = line.replace(/[:：]+$/, '').replace(/^[^A-Za-z]+|[^A-Za-z&]+$/g, '').trim()
  if (!t || t.length > 40) return null
  const hit = HEADINGS.find(([, re]) => re.test(t))
  return hit ? hit[0] : null
}

const clean = (s) => (s || '').replace(/\s+/g, ' ').trim()
const stripBullet = (l) => l.replace(BULLET, '').trim()
const wordCount = (s) => s.split(/\s+/).filter(Boolean).length

/* ---------- sections ---------- */
function splitSections(lines) {
  const sections = { header: [], summary: [], experience: [], education: [], skills: [], projects: [], other: [] }
  let current = 'header'
  for (const line of lines) {
    const h = headingOf(line)
    if (h) { current = h; continue }
    sections[current].push(line)
  }
  return sections
}

/* ---------- basics ---------- */
function parseBasics(headerLines, fullText, summaryLines) {
  const top = headerLines.slice(0, 8).join('\n')
  const tokens = headerLines.slice(0, 8)
    .flatMap((l) => l.split(/\s*[|•·●▪]\s*/))
    .map((t) => t.trim()).filter(Boolean)

  const isLocation = (t) => t.includes(',') && !/[@\d]/.test(t) && wordCount(t) <= 5
  const isName = (t) =>
    /^[A-Za-z][A-Za-z.'’-]*(\s+[A-Za-z][A-Za-z.'’-]*){0,4}$/.test(t) && !headingOf(t)
  const name = tokens.find(isName) || ''
  const title = tokens.find((t) => t !== name && !/[@\d]/.test(t) && !isLocation(t) && wordCount(t) <= 8 && /^[A-Za-z]/.test(t)) || ''
  const location = tokens.find(isLocation) || ''

  const phoneHit = (top.match(/\+?\d[\d\s().-]{7,}\d/g) || []).find((p) => {
    const digits = p.replace(/\D/g, '').length
    return digits >= 9 && digits <= 15 && !DATE_RANGE.test(p)
  })

  return {
    name,
    title,
    location,
    email: (fullText.match(EMAIL) || [''])[0],
    phone: phoneHit ? clean(phoneHit) : '',
    portfolio: (fullText.match(URL_RE) || [''])[0],
    summary: clean(summaryLines.join(' ')),
  }
}

/* ---------- skills ---------- */
function parseSkills(skillLines, fullText) {
  const fromSection = skillLines
    .flatMap((l) => l.replace(/^[^:]{1,30}:\s*/, '').split(/[,;|•·●▪]|\s{3,}/))
    .map((s) => clean(stripBullet(s)))
    .filter((s) => s && s.length <= 30 && wordCount(s) <= 4)

  const lower = fullText.toLowerCase()
  const fromDictionary = SKILLS.filter((a) => a.some((t) => has(lower, t))).map((a) => a[0])

  const seen = new Set()
  return [...fromSection, ...fromDictionary]
    .filter((s) => { const k = s.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true })
    .slice(0, 40)
}

/* ---------- experience ---------- */
const ROLE = /(engineer|developer|designer|manager|intern|analyst|lead|consultant|specialist|architect|director|officer|associate|assistant|administrator|coordinator|scientist|tester|qa|programmer|executive|head|founder|trainee)/i

function splitRoleCompany(parts) {
  let all = parts
    .flatMap((p) => p.split(/\s*\|\s*|\s+[—–-]\s+|\s+@\s+|\s+at\s+/i))
    .map((s) => s.replace(/^[,\s]+|[,\s]+$/g, ''))
    .filter(Boolean)
  if (all.length === 1 && all[0].includes(', ')) all = all[0].split(/,\s*/)
  const role = all.find((s) => ROLE.test(s)) || all[0] || ''
  const company = all.find((s) => s !== role) || ''
  return { role, company }
}

function parseExperience(lines) {
  const useRange = lines.some((l) => DATE_RANGE.test(l))
  const dateRe = useRange ? DATE_RANGE : SINGLE_DATE
  const anchors = lines.map((l, i) => (dateRe.test(l) ? i : -1)).filter((i) => i >= 0)
  if (!anchors.length) return []

  const headerOf = (i, prevAnchor) => {
    const own = clean(lines[i].replace(dateRe, '').replace(/[|,(–—-]+\s*$/, '').replace(/^\s*[|,)–—-]+/, ''))
    const prev = i - 1 > prevAnchor ? lines[i - 1] : null
    const prevOk = prev && !BULLET.test(prev) && wordCount(prev) <= 6 && !/[.!?]$/.test(prev) && !dateRe.test(prev)
    const ownShort = wordCount(own) < 4 && !/[|—–@]| - | at /i.test(own)
    if (own.length < 3) return prevOk ? { idx: i - 1, parts: [prev] } : { idx: i, parts: [] }
    return prevOk && ownShort ? { idx: i - 1, parts: [prev, own] } : { idx: i, parts: [own] }
  }

  const heads = anchors.map((i, k) => headerOf(i, k ? anchors[k - 1] : -1))
  return anchors.map((i, k) => {
    const end = k + 1 < anchors.length ? heads[k + 1].idx : lines.length
    const body = lines.slice(i + 1, end).map(stripBullet).filter(Boolean)
    const { role, company } = splitRoleCompany(heads[k].parts)
    return {
      company,
      role,
      dates: clean(lines[i].match(dateRe)?.[0] || ''),
      description: body.join('\n'),
    }
  })
}

/* ---------- education ---------- */
const DEGREE = /(?:^|[\s(,])(bachelors?|bachelor's|masters?|master's|b\.?s\.?c?|m\.?s\.?c?|b\.?a\.?|m\.?a\.?|b\.?tech|m\.?tech|bba|mba|mphil|ph\.?d|diploma|associate|intermediate|f\.?sc|matric|hssc|ssc)(?=[\s,.)(:-]|$)/i
const SCHOOL = /(university|college|institute|school|academy|polytechnic)/i

function parseEducation(lines) {
  const out = []
  let cur = null
  const push = () => { if (cur && (cur.school || cur.degree)) out.push(cur); cur = null }

  for (const raw of lines) {
    const line = stripBullet(raw)
    if (!line) continue
    const dates = clean(line.match(EDU_DATE)?.[0] || '')
    const text = clean(line.replace(EDU_DATE, '').replace(/[|,–—-]+\s*$/, '').replace(/^\s*[|,–—-]+/, ''))
    const hasDeg = DEGREE.test(text)
    const hasSch = SCHOOL.test(text)

    if (hasDeg && cur?.degree) push()
    if (hasSch && !hasDeg && cur?.school) push()
    cur ||= { school: '', degree: '', dates: '' }

    const parts = text.split(/\s*[|–—]\s*|\s+-\s+|,\s*/).map(clean).filter(Boolean)
    for (const part of parts) {
      if (/gpa|cgpa|percentage|marks|grade/i.test(part)) continue
      if (DEGREE.test(part) && !cur.degree) cur.degree = part
      else if (!cur.school) cur.school = part
    }
    if (dates && !cur.dates) cur.dates = dates
  }
  push()
  return out
}

/* ---------- projects ---------- */
const LEADING_VERB = /^(built|developed|designed|created|implemented|used|using|responsible|worked|integrated|deployed|managed|led|made)\b/i

function looksLikeTitle(text) {
  if (text.length > 80 || /[.!?]$/.test(text) || LEADING_VERB.test(text)) return false
  const ws = text.split(/\s+/).filter(Boolean)
  if (ws.length > 7) return false
  const caps = ws.filter((w) => /^[A-Z0-9&(]/.test(w)).length
  return caps / ws.length >= 0.6
}

function parseProjects(lines) {
  const out = []
  let cur = null
  for (const raw of lines) {
    const bullet = BULLET.test(raw)
    const text = clean(stripBullet(raw))
    if (!text) continue
    const label = text.match(/^(tech(?:nologies)?(?: stack)?|stack|built with|tools)\s*[:\-]\s*(.+)$/i)

    if (label && cur) { cur.tech = clean(label[2]); continue }
    if (!bullet && looksLikeTitle(text) && (!cur || cur.body.length)) {
      const parts = text.replace(URL_RE, '').split(/\s*[|–—]\s*|\s+-\s+/).map(clean).filter(Boolean)
      cur = { name: parts[0] || text, tech: parts.slice(1).join(', '), link: text.match(URL_RE)?.[0] || '', body: [] }
      out.push(cur)
    } else if (cur) {
      cur.body.push(text)
      if (!cur.link) cur.link = text.match(URL_RE)?.[0] || ''
    }
  }
  return out.map((p) => {
    const blob = `${p.name} ${p.body.join(' ')}`.toLowerCase()
    const tech = p.tech || SKILLS.filter((a) => a.some((t) => has(blob, t))).map((a) => a[0]).slice(0, 8).join(', ')
    return { name: p.name, link: p.link, tech, description: p.body.join('\n') }
  })
}

/* ---------- main ---------- */
export function parseResumeText(rawText) {
  const text = rawText.replace(/\r/g, '').replace(/\u00a0/g, ' ')
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  const sec = splitSections(lines)

  const basics = parseBasics(sec.header, text, sec.summary)
  const skills = parseSkills(sec.skills, text)
  const experience = parseExperience(sec.experience)
  const education = parseEducation(sec.education)
  const projects = parseProjects(sec.projects)

  const warnings = []
  if (!basics.name) warnings.push('Could not find your name')
  if (!basics.email) warnings.push('Could not find an email address')
  if (!basics.summary) warnings.push('No summary section detected')
  if (!experience.length) warnings.push('No experience section detected')
  if (!education.length) warnings.push('No education section detected')
  if (!skills.length) warnings.push('No skills found')

  return { basics, skills, experience, education, projects, warnings }
}