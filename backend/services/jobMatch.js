import { SKILLS } from './atsScore.js'
import { buildSkillsGraph } from './skillsGraph.js'

const LEVELS = ['intern', 'junior', 'mid', 'senior', 'staff', 'lead']
const WEIGHT = { Expert: 1, Advanced: 1, Intermediate: 0.75, Emerging: 0.5 }
const NOW = new Date().getFullYear()

const canon = (n) => {
  const s = String(n).trim()
  const hit = SKILLS.find((a) => a.some((t) => t.toLowerCase() === s.toLowerCase()))
  return hit ? hit[0] : s
}

const yearsOf = (dates) => {
  const ys = (dates || '').match(/(?:19|20)\d{2}/g)?.map(Number) || []
  if (!ys.length) return 0
  const start = ys[0]
  const end = /present|current|now|ongoing/i.test(dates) ? NOW : ys[1] ?? start
  return end > start ? end - start : 0.5
}

const STOP = new Set(['senior', 'junior', 'lead', 'staff', 'intern', 'mid', 'the', 'and', 'of', 'for', 'sr', 'jr', 'ii', 'iii'])
const tokens = (s) =>
  new Set((s || '').toLowerCase().split(/[^a-z0-9+#]+/).filter((w) => w.length > 1 && !STOP.has(w)))

// rough level from total years of experience
const userLevel = (resume) => {
  const years = (resume.experience || []).reduce((s, e) => s + yearsOf(e.dates), 0)
  return years < 1 ? 0 : years < 2 ? 1 : years < 4 ? 2 : years < 7 ? 3 : years < 10 ? 4 : 5
}

export function rankJobs(resume, jobs) {
  const graph = buildSkillsGraph(resume)
  const have = new Map(graph.skills.map((s) => [s.name.toLowerCase(), s]))
  const weightOf = (n) => WEIGHT[have.get(n.toLowerCase())?.level] ?? 0
  const mine = tokens([resume.basics?.title, ...(resume.experience || []).map((e) => e.role)].join(' '))
  const lvl = userLevel(resume)

  return jobs
    .map((job) => {
      const req = [...new Set((job.skills || []).map(canon).filter(Boolean))]
      const coverage = req.length ? req.reduce((s, n) => s + weightOf(n), 0) / req.length : 0

      const jt = tokens(job.title)
      const overlap = jt.size ? [...jt].filter((w) => mine.has(w)).length / jt.size : 0

      const diff = Math.abs(Math.max(0, LEVELS.indexOf(job.seniority)) - lvl)
      const fit = Math.max(0, 15 - Math.min(diff, 3) * 5)

      return {
        id: String(job._id),
        title: job.title,
        company: job.company,
        location: job.location,
        workType: job.workType,
        seniority: job.seniority,
        salary: job.salary,
        isSample: !!job.isSample,
        match: Math.round(coverage * 70 + overlap * 15 + fit),
        skills: req.map((name) => ({ name, matched: have.has(name.toLowerCase()) })),
      }
    })
    .sort((a, b) => b.match - a.match)
}

const list = (a) => (a.length <= 1 ? a.join('') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`)
const LEVEL_NAME = {
  intern: 'an intern-level', junior: 'a junior', mid: 'a mid-level',
  senior: 'a senior', staff: 'a staff-level', lead: 'a lead',
}

export const publicJob = (job) => ({
  id: String(job._id),
  title: job.title,
  company: job.company,
  location: job.location,
  workType: job.workType,
  seniority: job.seniority,
  salary: job.salary,
  description: job.description || '',
  requirements: job.requirements?.length
    ? job.requirements
    : (job.skills || []).map((s) => `Experience with ${s}`),
  skills: job.skills || [],
  isSample: !!job.isSample,
})

// one job, scored against the resume, with a plain-language explanation
export function analyzeJob(resume, job) {
  const base = rankJobs(resume, [job])[0]
  const graph = buildSkillsGraph(resume)
  const bySkill = new Map(graph.skills.map((s) => [s.name.toLowerCase(), s]))

  const have = base.skills.filter((s) => s.matched).map((s) => bySkill.get(s.name.toLowerCase()))
  const strong = have.filter((s) => s.level !== 'Emerging').sort((a, b) => b.score - a.score).map((s) => s.name)
  const thin = have.filter((s) => s.level === 'Emerging').map((s) => s.name)
  const missing = base.skills.filter((s) => !s.matched).map((s) => s.name)

  const years = Math.round((resume.experience || []).reduce((s, e) => s + yearsOf(e.dates), 0) * 2) / 2
  const diff = Math.max(0, LEVELS.indexOf(job.seniority)) - userLevel(resume)

  const why = []
  if (strong.length) why.push(`Your ${list(strong.slice(0, 3))} experience lines up with what this role asks for.`)
  if (thin.length) why.push(`You list ${list(thin.slice(0, 3))}, but your experience barely shows it. Add where you used it, with results.`)
  if (missing.length) why.push(`Not on your resume yet: ${list(missing.slice(0, 4))}. Add them only if you really have them, or build a small project that uses them.`)
  if (diff >= 2) {
    why.push(`This is ${LEVEL_NAME[job.seniority] || 'a'} role and your resume shows about ${years} year${years === 1 ? '' : 's'} of experience, so it may be a stretch.`)
  } else if (diff <= -2) {
    why.push(`This role looks below your experience level (about ${years} years on your resume).`)
  } else {
    why.push('The seniority looks like a reasonable fit for your experience.')
  }

  return { ...publicJob(job), match: base.match, skills: base.skills, why }
}