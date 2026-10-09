import 'dotenv/config'
import Job from '../models/Job.js'
import { localDB } from '../config/db.js'

const jobs = [
  { title: 'Full-Stack (MERN) Developer Intern', company: 'Nexa Labs', workType: 'remote', location: 'Remote', seniority: 'intern', salary: 'Stipend',
    description: 'Join a small product team building web apps with the MERN stack. You will ship real features under the guidance of senior engineers.',
    requirements: ['Hands-on projects with React and Node.js', 'Basic MongoDB and REST API knowledge', 'Comfortable with Git and pull requests', 'Eager to learn and take feedback'],
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'] },
  { title: 'Junior MERN Stack Developer', company: 'Orbit Software', workType: 'hybrid', location: 'Islamabad', seniority: 'junior', salary: 'PKR 90–130k / month',
    description: 'Build and maintain client web applications end to end, from React interfaces to Express APIs backed by MongoDB.',
    requirements: ['0–2 years building MERN applications', 'React, Node.js, Express and MongoDB', 'Designing and consuming REST APIs', 'Version control with Git'],
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'Git'] },
  { title: 'Frontend Developer', company: 'Pixelwave', workType: 'onsite', location: 'Lahore', seniority: 'junior', salary: 'PKR 80–120k / month',
    description: 'Turn designs into fast, accessible interfaces for e-commerce clients.',
    requirements: ['Solid HTML, CSS and JavaScript', 'React and component-based design', 'Tailwind or a similar CSS framework', 'Comfortable with a Git workflow'],
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind', 'Git'] },
  { title: 'Backend Engineer (Node.js)', company: 'Cloudbridge', workType: 'remote', location: 'Remote', seniority: 'mid', salary: '$40–60k',
    description: 'Own the APIs behind our SaaS product: design endpoints, secure them, and keep them fast.',
    requirements: ['2+ years with Node.js and Express', 'MongoDB and SQL data modeling', 'Authentication with JWT', 'Docker for local and deployed environments'],
    skills: ['Node.js', 'Express', 'MongoDB', 'SQL', 'Docker', 'REST APIs', 'JWT'] },
  { title: 'Senior Full-Stack Engineer', company: 'Northwind Health', workType: 'remote', location: 'Remote', seniority: 'senior', salary: '$110–140k',
    description: 'Lead feature delivery across our patient scheduling platform, from the React front end to Node services, in a regulated healthcare setting.',
    requirements: ['5+ years of full-stack experience', 'React, TypeScript and Node.js', 'MongoDB and AWS in production', 'Automated testing habits', 'Healthcare or regulated industry background a plus'],
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Testing', 'Healthcare'] },
  { title: 'Machine Learning Engineer', company: 'Insightly', workType: 'hybrid', location: 'Karachi', seniority: 'mid', salary: 'PKR 250–350k / month',
    description: 'Build and ship NLP models that power search and recommendations, working with product and data teams.',
    requirements: ['2+ years with Python and ML libraries', 'Experience with NLP and embeddings', 'SQL for data analysis', 'Containerized deployment with Docker'],
    skills: ['Python', 'Machine learning', 'NLP', 'SQL', 'Docker'] },
  { title: 'Product Designer', company: 'Fable Systems', workType: 'remote', location: 'Remote', seniority: 'mid', salary: '$90–120k',
    description: 'Design flows for our scheduling product, from research through hand-off, and contribute to the design system.',
    requirements: ['3+ years of product design', 'Figma prototyping and wireframing', 'Running user research', 'Contributing to a design system'],
    skills: ['Figma', 'Prototyping', 'User research', 'Wireframing', 'Design systems'] },
  { title: 'Senior Product Designer', company: 'Northwind Health', workType: 'remote', location: 'Remote', seniority: 'senior', salary: '$145–170k',
    description: 'Lead end-to-end design for our patient scheduling platform. Partner with engineering and clinical operations, run discovery research, and own our design system.',
    requirements: ['5+ years of product design experience', 'Advanced Figma and design systems experience', 'Accessibility-minded design practice', 'Healthcare or regulated industry background a plus'],
    skills: ['Figma', 'Design systems', 'Discovery research', 'Healthcare', 'Accessibility', 'Cross-functional'] },
  { title: 'Design Systems Lead', company: 'Ridgeline Co.', workType: 'hybrid', location: 'Berlin', seniority: 'lead', salary: '$150–180k',
    description: 'Own and grow the component library and guidelines used by multiple product teams.',
    requirements: ['6+ years in product or UI design', 'Led a design system adopted across teams', 'Accessibility standards (WCAG)', 'Mentoring other designers'],
    skills: ['Design systems', 'Figma', 'Accessibility', 'Leadership', 'Mentoring'] },
  { title: 'UX Researcher', company: 'Hearth Financial', workType: 'remote', location: 'Remote', seniority: 'mid', salary: '$85–110k',
    description: 'Plan and run research that shapes our fintech roadmap, from interviews to usability tests.',
    requirements: ['3+ years in UX research', 'Usability testing and analytics', 'Experience with A/B testing', 'Clear written findings for stakeholders'],
    skills: ['User research', 'Usability testing', 'Analytics', 'A/B testing', 'Fintech'] },
  { title: 'Project Manager', company: 'Atlas Digital', workType: 'onsite', location: 'Islamabad', seniority: 'mid', salary: 'PKR 200–280k / month',
    description: 'Coordinate software delivery across design, engineering and clients, keeping scope and timelines on track.',
    requirements: ['3+ years in project management', 'Agile delivery and Jira', 'Stakeholder communication', 'Clear status reporting'],
    skills: ['Project management', 'Agile', 'Jira', 'Stakeholder management', 'Communication'] },
]

await localDB.asPromise()
await Job.deleteMany({ isSample: true })
await Job.insertMany(jobs.map((j) => ({ ...j, isSample: true })))
console.log(`Seeded ${jobs.length} sample jobs`)
process.exit(0)