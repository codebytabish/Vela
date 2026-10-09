import { SKILLS } from './atsScore.js'

// canonical names must match the SKILLS dictionary
const RELATED = {
  React: ['TypeScript', 'Next.js', 'Redux', 'Testing'],
  JavaScript: ['TypeScript', 'React', 'Node.js'],
  'Node.js': ['Express', 'MongoDB', 'REST APIs', 'Docker'],
  Express: ['MongoDB', 'JWT', 'REST APIs', 'Testing'],
  MongoDB: ['Mongoose', 'Node.js', 'SQL'],
  'REST APIs': ['GraphQL', 'JWT', 'Testing'],
  HTML: ['CSS', 'Tailwind', 'Accessibility'],
  CSS: ['Tailwind', 'JavaScript', 'Accessibility'],
  Git: ['GitHub', 'CI/CD'],
  Docker: ['CI/CD', 'AWS'],
  Python: ['Machine learning', 'SQL'],
  'Machine learning': ['NLP', 'Embeddings', 'Python'],
  Figma: ['Prototyping', 'Design systems', 'Accessibility', 'Usability testing'],
  'UX design': ['User research', 'Wireframing', 'Usability testing'],
  'UI design': ['Design systems', 'Accessibility', 'Interaction design'],
  'User research': ['Usability testing', 'A/B testing', 'Analytics'],
  'Design systems': ['Accessibility', 'Cross-functional'],
  Prototyping: ['Interaction design', 'Usability testing'],
  Agile: ['Jira', 'Project management'],
  Leadership: ['Mentoring', 'Stakeholder management'],
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')
const NOW = new Date().getFullYear()

const canon = (n) => {
  const hit = SKILLS.find((a) => a.some((t) => t.toLowerCase() === n.toLowerCase()))
  return hit ? hit[0] : n
}
const aliasesOf = (name) => SKILLS.find((a) => a[0].toLowerCase() === name.toLowerCase()) || [name]

// number of times any alias appears as a whole term
const countIn = (text, aliases) => {
  const alts = [...aliases].sort((a, b) => b.length - a.length).map((a) => esc(a.toLowerCase())).join('|')
  const re = new RegExp(`(?<![a-z0-9+#])(?:${alts})(?![a-z0-9+#])`, 'g')
  return (text.match(re) || []).length
}

const yearsOf = (dates) => {
  const ys = (dates || '').match(/(?:19|20)\d{2}/g)?.map(Number) || []
  if (!ys.length) return 0
  const start = ys[0]
  const end = /present|current|now|ongoing/i.test(dates) ? NOW : ys[1] ?? start
  return end > start ? end - start : 0.5
}

const levelOf = (score) =>
  score >= 70 ? 'Expert' : score >= 45 ? 'Advanced' : score >= 25 ? 'Intermediate' : 'Emerging'

export function buildSkillsGraph(r) {
  const listed = (r.skills || []).map((s) => s.trim()).filter(Boolean).map(canon)
  const listedSet = new Set(listed.map((s) => s.toLowerCase()))

  const roles = (r.experience || [])
    .filter((e) => e.role || e.company || e.description)
    .map((e) => ({ text: [e.role, e.company, e.description].join(' ').toLowerCase(), years: yearsOf(e.dates) }))
  const projects = (r.projects || [])
    .filter((p) => p.name || p.description)
    .map((p) => ({ text: [p.name, p.tech, p.description].join(' ').toLowerCase() }))
  const summary = (r.basics?.summary || '').toLowerCase()
  const everything = [summary, ...roles.map((x) => x.text), ...projects.map((x) => x.text)].join(' \n ')

  // listed skills + dictionary skills found in the text
  const names = new Map()
  listed.forEach((n) => names.set(n.toLowerCase(), n))
  SKILLS.forEach((a) => {
    if (!names.has(a[0].toLowerCase()) && countIn(everything, a) > 0) names.set(a[0].toLowerCase(), a[0])
  })

  const skills = [...names.values()]
    .map((name) => {
      const al = aliasesOf(name)
      const inRoles = roles.filter((x) => countIn(x.text, al) > 0)
      const inProjects = projects.filter((x) => countIn(x.text, al) > 0).length
      const mentions = countIn(everything, al)
      const years = Math.min(10, inRoles.reduce((s, x) => s + x.years, 0))
      const isListed = listedSet.has(name.toLowerCase())

      const score = Math.min(
        100,
        (isListed ? 15 : 0) +
          Math.min(mentions, 5) * 8 +
          Math.min(inRoles.length, 2) * 10 +
          Math.min(years, 3) * 5 +
          Math.min(inProjects, 2) * 5
      )
      return {
        name,
        score: Math.round(score),
        level: levelOf(score),
        listed: isListed,
        evidence: { mentions, roles: inRoles.length, projects: inProjects, years: Math.round(years * 2) / 2 },
      }
    })
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, 30)

  // suggestions: job keywords first, then related skills
  const have = new Set(skills.map((s) => s.name.toLowerCase()))
  const suggested = []
  const seen = new Set()
  const push = (name, reason) => {
    const k = name.toLowerCase()
    if (have.has(k) || seen.has(k)) return
    seen.add(k)
    suggested.push({ name, reason })
  }

  const ats = r.ats
  for (const k of ats?.missing || []) {
    push(k, ats.jobTitle ? `Asked for in ${ats.jobTitle}` : 'In your target job description')
  }

  const votes = {}
  for (const s of skills) for (const rel of RELATED[s.name] || []) (votes[rel] ||= []).push(s.name)
  Object.entries(votes)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([name, from]) => push(name, `Pairs with ${from.slice(0, 2).join(', ')}`))

  return { skills, suggested: suggested.slice(0, 6) }
}