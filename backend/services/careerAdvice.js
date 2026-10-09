import { buildSkillsGraph } from './skillsGraph.js'

// skill names must match the SKILLS dictionary in atsScore.js
const PATHS = [
  { title: 'Full-Stack (MERN) Developer',
    core: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'Git'],
    stretch: ['TypeScript', 'Docker', 'JWT', 'Testing', 'AWS'] },
  { title: 'Frontend Developer',
    core: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
    stretch: ['TypeScript', 'Tailwind', 'Testing', 'Accessibility'] },
  { title: 'Backend Developer',
    core: ['Node.js', 'Express', 'MongoDB', 'SQL', 'REST APIs', 'Git'],
    stretch: ['Docker', 'AWS', 'CI/CD', 'JWT', 'Testing'] },
  { title: 'Data / ML Engineer',
    core: ['Python', 'SQL', 'Machine learning', 'Git'],
    stretch: ['NLP', 'Embeddings', 'Docker', 'AWS'] },
  { title: 'Product Designer',
    core: ['Figma', 'Prototyping', 'User research', 'Wireframing', 'UX design'],
    stretch: ['Design systems', 'Usability testing', 'Accessibility', 'Interaction design'] },
  { title: 'Design Systems Lead',
    core: ['Design systems', 'Figma', 'Accessibility', 'Cross-functional'],
    stretch: ['Leadership', 'Mentoring', 'Stakeholder management'] },
  { title: 'UX Researcher',
    core: ['User research', 'Usability testing', 'Discovery research', 'Analytics'],
    stretch: ['A/B testing', 'Stakeholder management', 'Communication'] },
  { title: 'Project / Product Manager',
    core: ['Project management', 'Agile', 'Roadmap', 'Stakeholder management', 'Communication'],
    stretch: ['Jira', 'Analytics', 'Leadership'] },
]

const WEIGHT = { Expert: 1, Advanced: 1, Intermediate: 0.75, Emerging: 0.5 }

export const QUESTIONS = [
  { id: 'focus', label: 'What should I focus on next?' },
  { id: 'gaps', label: 'What skill gaps do I have?' },
  { id: 'strengths', label: 'What are my strengths?' },
  { id: 'paths', label: 'Which roles am I closest to?' },
  { id: 'resume', label: 'How can I improve my resume?' },
  { id: 'interview', label: 'How do I prepare for interviews?' },
]

const RULES = [
  ['interview', /interview|prepar|question/i],
  ['resume', /resume|\bcv\b|ats|score/i],
  ['gaps', /gap|missing|lack|learn|need to know/i],
  ['strengths', /strength|good at|best at|strong/i],
  ['paths', /role|path|job|career|position|closest|fit/i],
  ['focus', /focus|next|priorit|first|should i/i],
]
export const detectIntent = (text) => RULES.find(([, re]) => re.test(text))?.[0] || 'help'

const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`
const list = (a) => (a.length <= 1 ? a.join('') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`)
const labelOf = (p) =>
  p.readiness >= 85 && p.coreGaps.length === 0 ? 'Ready now' : plural(p.gaps.length, 'skill gap')

export function buildContext(resume, portfolioCount) {
  const graph = buildSkillsGraph(resume)
  const have = new Map(graph.skills.map((s) => [s.name.toLowerCase(), s]))
  const weightOf = (n) => WEIGHT[have.get(n.toLowerCase())?.level] ?? 0
  const cover = (arr) => (arr.length ? arr.reduce((s, n) => s + weightOf(n), 0) / arr.length : 1)

  const paths = PATHS.map((p) => {
    const all = [...p.core, ...p.stretch]
    return {
      title: p.title,
      readiness: Math.round((cover(p.core) * 0.7 + cover(p.stretch) * 0.3) * 100),
      gaps: all.filter((n) => !have.has(n.toLowerCase())),
      coreGaps: p.core.filter((n) => !have.has(n.toLowerCase())),
      weak: p.core.filter((n) => have.get(n.toLowerCase())?.level === 'Emerging'),
    }
  }).sort((a, b) => b.readiness - a.readiness)

  const ats = resume.ats
  const target = ats?.keywordScored && ats.jobTitle
    ? { title: ats.jobTitle, readiness: ats.keyword, gaps: ats.missing || [] }
    : null

  const pathCards = paths.slice(0, 4).map((p) => ({
    kind: 'path', title: p.title, label: labelOf(p), readiness: p.readiness, gaps: p.gaps.slice(0, 4),
  }))
  if (target) {
    pathCards.unshift({
      kind: 'target',
      title: target.title,
      label: target.gaps.length ? plural(target.gaps.length, 'keyword gap') : 'Keywords covered',
      readiness: target.readiness,
      gaps: target.gaps.slice(0, 4),
    })
  }

  return {
    graph, paths, target, ats, pathCards, portfolioCount,
    projectName: (resume.projects || []).find((p) => p.name)?.name || '',
  }
}

export function overview(ctx) {
  if (!ctx.graph.skills.length) {
    return 'Add skills and describe your work in the builder, and I can tell you which roles fit you and what is missing.'
  }
  const best = ctx.paths[0]
  const gapText = best.coreGaps.length
    ? `${plural(best.coreGaps.length, 'core skill')} to build: ${list(best.coreGaps.slice(0, 3))}.`
    : 'You cover its core skills.'
  return `You're closest to ${best.title} (${best.readiness}% skills match). ${gapText} Want a breakdown of what to focus on next?`
}

function focus(ctx) {
  const best = ctx.paths[0]
  const items = []

  if (ctx.target?.gaps.length) {
    items.push(`Close the keyword gaps for ${ctx.target.title}: ${list(ctx.target.gaps.slice(0, 4))}. Add only what you can honestly back up.`)
  }
  if (best.coreGaps.length) {
    items.push(`Build evidence for ${best.title}: you are missing ${list(best.coreGaps.slice(0, 3))}. A small project that uses them is the fastest proof.`)
  } else if (best.weak.length) {
    items.push(`Strengthen ${list(best.weak.slice(0, 3))} for ${best.title}: mention them with results in your experience and projects.`)
  }
  if (ctx.ats?.tips?.length) items.push(ctx.ats.tips[0])
  else if (!ctx.ats) items.push('Open the builder, add a target job, and click Save & score to get your ATS report.')
  if (ctx.portfolioCount === 0) {
    items.push('Add 2 or 3 case studies to your portfolio: what you built, your role, and the result.')
  }

  return items.length
    ? { intent: 'focus', text: "Here is where I'd focus, in order:", bullets: items.slice(0, 4) }
    : { intent: 'focus', text: 'Your profile looks solid for now. Keep your descriptions specific and apply to roles that match your top skills.', bullets: [] }
}

function gaps(ctx) {
  const best = ctx.paths[0]
  const bullets = []
  if (ctx.target) {
    bullets.push(
      ctx.target.gaps.length
        ? `For ${ctx.target.title}, the job description asks for: ${list(ctx.target.gaps.slice(0, 5))}.`
        : `Your resume covers the keywords found in the ${ctx.target.title} job description.`
    )
  }
  if (best.coreGaps.length) bullets.push(`Missing core skills: ${list(best.coreGaps)}.`)
  if (best.weak.length) bullets.push(`Thin evidence (listed but barely shown): ${list(best.weak)}.`)
  const stretch = best.gaps.filter((g) => !best.coreGaps.includes(g))
  if (stretch.length) bullets.push(`Nice to have: ${list(stretch.slice(0, 4))}.`)
  if (!bullets.length) bullets.push('No gaps against the core skills of this path.')
  return { intent: 'gaps', text: `Measured against ${best.title} (${best.readiness}% match):`, bullets }
}

function strengths(ctx) {
  const top = ctx.graph.skills.filter((s) => s.score >= 25).slice(0, 5)
  if (!top.length) {
    return {
      intent: 'strengths',
      text: 'I do not see strong evidence yet. Skills only listed in the Skills tab do not count much. Mention them in your roles and projects, with results.',
      bullets: [],
    }
  }
  return {
    intent: 'strengths',
    text: 'Your strongest skills, based on evidence in your resume:',
    bullets: top.map((s) => {
      const e = s.evidence
      const bits = [e.mentions && plural(e.mentions, 'mention'), e.roles && plural(e.roles, 'role'), e.projects && plural(e.projects, 'project')].filter(Boolean)
      return `${s.name}: ${s.level}${bits.length ? ` (${bits.join(', ')})` : ''}`
    }),
  }
}

function paths(ctx) {
  return {
    intent: 'paths',
    text: 'Roles closest to your current skills:',
    bullets: ctx.paths.slice(0, 4).map((p) => `${p.title}: ${p.readiness}% match, ${labelOf(p).toLowerCase()}`),
  }
}

function resumeAdvice(ctx) {
  if (!ctx.ats) {
    return {
      intent: 'resume',
      text: 'You have not been scored yet. Open the builder, add a target job, and click Save & score.',
      bullets: [],
    }
  }
  return {
    intent: 'resume',
    text: `Your last ATS score is ${ctx.ats.score}/100. The biggest fixes:`,
    bullets: ctx.ats.tips.length ? ctx.ats.tips.slice(0, 4) : ['Nothing flagged. Nice work.'],
  }
}

function interview(ctx) {
  const top = ctx.graph.skills.filter((s) => s.score >= 25).slice(0, 3).map((s) => s.name)
  const best = ctx.paths[0]
  const bullets = []
  if (top.length) bullets.push(`Be ready to explain ${list(top)} with one real example each: the problem, what you did, and what happened.`)
  if (ctx.projectName) bullets.push(`Rehearse a 2-minute walkthrough of ${ctx.projectName}: the goal, your part, your tech choices, and the result.`)
  if (best.coreGaps.length) bullets.push(`Be honest about gaps like ${list(best.coreGaps.slice(0, 2))}: say what you have learned so far and how you would close the gap.`)
  bullets.push('Prepare two questions for them about the team and how success is measured in the first 90 days.')
  return { intent: 'interview', text: 'How I would prepare, based on your profile:', bullets }
}

export function answer(ctx, intent) {
  switch (intent) {
    case 'focus': return focus(ctx)
    case 'gaps': return gaps(ctx)
    case 'strengths': return strengths(ctx)
    case 'paths': return paths(ctx)
    case 'resume': return resumeAdvice(ctx)
    case 'interview': return interview(ctx)
    default:
      return {
        intent: 'help',
        text: "I answer from your resume, skills and ATS score, so I may miss that one. Try one of the suggested questions below.",
        bullets: [],
      }
  }
}