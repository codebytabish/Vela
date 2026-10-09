// canonical display name first, then aliases (matching is case-insensitive)
export const SKILLS = [
  // design
  ['Figma'], ['Sketch'], ['Adobe XD', 'xd'], ['Prototyping', 'prototype', 'prototypes'],
  ['Wireframing', 'wireframes'], ['Design systems', 'design system'],
  ['User research', 'ux research'], ['Discovery research'], ['Usability testing'],
  ['Product design'], ['UX design', 'ux'], ['UI design', 'ui'], ['Interaction design'],
  ['Accessibility', 'wcag'], ['Cross-functional', 'cross functional'],
  // web / software
  ['JavaScript', 'es6'], ['TypeScript'], ['React', 'reactjs', 'react.js'],
  ['Next.js', 'nextjs'], ['Redux'], ['Node.js', 'nodejs', 'node'],
  ['Express', 'express.js', 'expressjs'], ['MongoDB', 'mongo'], ['Mongoose'],
  ['SQL'], ['PostgreSQL', 'postgres'], ['MySQL'], ['REST APIs', 'rest api', 'restful'],
  ['GraphQL'], ['HTML'], ['CSS'], ['Tailwind', 'tailwindcss'], ['Git'], ['GitHub'],
  ['Docker'], ['AWS'], ['Azure'], ['CI/CD', 'cicd'], ['JWT'], ['Python'], ['Java'],
  ['C++'], ['C#'], ['Machine learning'], ['NLP'], ['Embeddings'],
  ['Testing', 'jest', 'unit testing'], ['Agile', 'scrum'], ['Jira'],
  // general
  ['Stakeholder management', 'stakeholders'], ['Project management'], ['Communication'],
  ['Leadership'], ['Analytics'], ['A/B testing', 'ab testing'], ['Roadmap'], ['Mentoring'],
  // domains
  ['Healthcare'], ['Regulated industry', 'regulated industries', 'hipaa'], ['Clinical'],
  ['Fintech'], ['E-commerce', 'ecommerce'], ['SaaS', 'b2b saas'],
]

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')
export const has = (text, term) =>
  new RegExp(`(^|[^a-z0-9+#])${esc(term.toLowerCase())}([^a-z0-9+#]|$)`).test(text)
const words = (t) => (t || '').trim().split(/\s+/).filter(Boolean)

const resumeText = (r) =>
  [
    r.basics?.title, r.basics?.summary,
    ...(r.skills || []),
    ...(r.experience || []).flatMap((e) => [e.role, e.company, e.description]),
    ...(r.projects || []).flatMap((p) => [p.name, p.tech, p.description]),
    ...(r.education || []).flatMap((e) => [e.degree, e.school]),
  ].filter(Boolean).join(' \n ').toLowerCase()

function keywordMatch(resume, jd) {
  if (!jd || !jd.trim()) return null
  const jdText = jd.toLowerCase()
  const text = resumeText(resume)
  const found = SKILLS.filter((a) => a.some((t) => has(jdText, t)))
  if (!found.length) return null
  const matched = found.filter((a) => a.some((t) => has(text, t))).map((a) => a[0])
  const missing = found.filter((a) => !a.some((t) => has(text, t))).map((a) => a[0])
  return { score: Math.round((matched.length / found.length) * 100), matched, missing }
}

function sectionScore(r) {
  const b = r.basics || {}
  const checks = [
    [20, words(b.summary).length >= 15, 'Add a professional summary of at least 15 words'],
    [25, (r.experience || []).some((e) => e.role && e.company), 'Add a role with both company and job title'],
    [15, (r.education || []).some((e) => e.school), 'Add your education'],
    [20, (r.skills || []).length >= 5, 'List at least 5 skills'],
    [10, (r.projects || []).some((p) => p.name), 'Add at least one project'],
    [10, !!(b.name && b.email), 'Add your name and email'],
  ]
  return {
    score: checks.reduce((s, [w, ok]) => s + (ok ? w : 0), 0),
    tips: checks.filter((c) => !c[1]).map((c) => c[2]),
  }
}

function formattingScore(r) {
  let s = 100
  const tips = []
  const b = r.basics || {}
  if (!b.email) { s -= 20; tips.push('Add an email address so recruiters can reach you') }
  if (!b.location) s -= 5
  const exp = (r.experience || []).filter((e) => e.role || e.company)
  const undated = exp.filter((e) => !e.dates).length
  if (undated) { s -= Math.min(30, undated * 10); tips.push('Add dates to every role') }
  const dashes = new Set(exp.map((e) => e.dates || '').join(' ').match(/[-–—]/g) || [])
  if (dashes.size > 1) { s -= 10; tips.push('Use one dash style in your dates') }
  const empties = [...(r.experience || []), ...(r.education || []), ...(r.projects || [])]
    .filter((x) => Object.values(x).every((v) => !String(v || '').trim())).length
  if (empties) { s -= empties * 5; tips.push('Remove empty entries') }
  return { score: Math.max(0, s), tips }
}

export const VERBS = /^(led|built|designed|developed|created|managed|launched|improved|reduced|increased|delivered|owned|drove|implemented|shipped|partnered|ran|wrote|established|optimized|automated|mentored|migrated|analyzed|collaborated)\b/i
function readabilityScore(r) {
  const tips = []
  let s = 0
  const n = words(r.basics?.summary).length
  if (n >= 20 && n <= 70) s += 25
  else tips.push('Keep your summary between 20 and 70 words')

  const descs = [
    ...(r.experience || []).map((e) => e.description),
    ...(r.projects || []).map((p) => p.description),
  ].filter((d) => d && d.trim())

  if (!descs.length) {
    tips.push('Describe what you did in each role and project')
    return { score: s, tips }
  }
  const share = (fn) => descs.filter(fn).length / descs.length

  const withNumbers = share((d) => /\d/.test(d))
  s += Math.round(withNumbers * 30)
  if (withNumbers < 0.5) tips.push('Add numbers to your descriptions (users, percentages, time saved)')

  const withVerbs = share((d) => VERBS.test(d.trim()))
  s += Math.round(withVerbs * 20)
  if (withVerbs < 0.5) tips.push('Start descriptions with action verbs like Led, Built or Reduced')

  const sentences = descs.join(' ').split(/[.!?\n]+/).filter((x) => x.trim())
  const avg = words(descs.join(' ')).length / Math.max(1, sentences.length)
  if (avg <= 25) s += 25
  else tips.push('Shorten long sentences (aim for 25 words or fewer)')

  return { score: Math.min(100, s), tips }
}

export function scoreResume(resume, target = {}) {
  const kw = keywordMatch(resume, target.jobDescription)
  const sec = sectionScore(resume)
  const fmt = formattingScore(resume)
  const read = readabilityScore(resume)
  const kwScored = !!kw

  const overall = kwScored
    ? 0.4 * kw.score + 0.2 * fmt.score + 0.2 * sec.score + 0.2 * read.score
    : (fmt.score + sec.score + read.score) / 3

  const tips = [
    ...(kwScored ? [] : ['Paste a job description in the Target job tab to get a keyword match score']),
    ...(kw?.missing?.length
      ? [`Add these keywords where they honestly apply: ${kw.missing.slice(0, 6).join(', ')}`]
      : []),
    ...sec.tips, ...fmt.tips, ...read.tips,
  ].slice(0, 6)

  return {
    score: Math.round(overall),
    keyword: kwScored ? kw.score : null,
    keywordScored: kwScored,
    formatting: fmt.score,
    sections: sec.score,
    readability: read.score,
    matched: kw?.matched || [],
    missing: kw?.missing || [],
    tips,
    jobTitle: target.jobTitle || '',
    company: target.company || '',
    scoredAt: new Date(),
  }
}