/**
 * routes/jobs.js
 * --------------
 * Endpoints (all under /api/jobs, login required):
 *   GET  /recommendations  open jobs ranked against my latest resume
 *   GET  /:id              one job + my match score + "why it's a match" + have I applied?
 *   POST /:id/score        make this job my resume's target and score against it
 *   POST /                 (employers only) create a job
 *
 * NOTE: '/recommendations' must stay ABOVE '/:id', otherwise Express would read the word
 * "recommendations" as a job id.
 */
import express from 'express'
import Resume from '../models/Resume.js'
import Job from '../models/Job.js'
import Application from '../models/Application.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { rankJobs, analyzeJob, publicJob } from '../services/jobMatch.js'
import { scoreResume } from '../services/atsScore.js'

const router = express.Router()
router.use(requireAuth)

// ---------- GET /api/jobs/recommendations ----------
router.get('/recommendations', async (req, res) => {
  try {
    // My newest resume is the one used for matching.
    const resume = await Resume.findOne({ userId: req.user.id }).sort({ updatedAt: -1 })
    if (!resume) return res.json({ hasResume: false, jobs: [] })

    const jobs = await Job.find({ status: 'open' }).lean()
    res.json({ hasResume: true, jobs: rankJobs(resume.toObject(), jobs) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ---------- GET /api/jobs/:id ----------
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, status: 'open' }).lean()
    if (!job) return res.status(404).json({ message: 'Job not found' })

    // Has this user already applied? (the job page shows "Applied ✓" instead of the Apply button)
    const applied = !!(await Application.exists({ userId: req.user.id, jobId: job._id }))

    const resume = await Resume.findOne({ userId: req.user.id }).sort({ updatedAt: -1 })
    // No resume: still show the job, just without a match score.
    if (!resume) return res.json({ hasResume: false, job: publicJob(job), applied })

    res.json({ hasResume: true, job: analyzeJob(resume.toObject(), job), applied })
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ message: 'Job not found' })
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ---------- POST /api/jobs/:id/score ----------
// Sets this job as the resume's "target job" and runs the ATS scorer against it.
router.post('/:id/score', async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, status: 'open' }).lean()
    if (!job) return res.status(404).json({ message: 'Job not found' })

    const resume = await Resume.findOne({ userId: req.user.id }).sort({ updatedAt: -1 })
    if (!resume) return res.status(404).json({ message: 'Build or upload a resume first' })

    // The scorer reads keywords from one block of text, so combine everything the job says.
    resume.target = {
      jobTitle: job.title,
      company: job.company,
      jobDescription: [job.description, ...(job.requirements || []), (job.skills || []).join(', ')]
        .filter(Boolean)
        .join('\n'),
    }

    const r = resume.toObject()
    const ats = scoreResume(r, r.target)
    resume.ats = ats
    resume.atsScore = ats.score
    await resume.save()

    res.json({ ats })
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ message: 'Job not found' })
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ---------- POST /api/jobs (employers only) ----------
router.post('/', requireRole('employer'), async (req, res) => {
  try {
    const b = req.body
    const title = String(b.title || '').trim()
    const company = String(b.company || '').trim()
    if (!title || !company) return res.status(400).json({ message: 'Title and company are required' })

    // Clean the skills list: strings only, not empty, max 40 chars each, max 20 skills.
    const skills = (Array.isArray(b.skills) ? b.skills : [])
      .map((s) => String(s).trim())
      .filter((s) => s && s.length <= 40)
      .slice(0, 20)

    const job = await Job.create({
      postedBy: req.user.id,
      title,
      company,
      location: b.location,
      // Only accept known values, otherwise fall back to a default.
      workType: ['remote', 'hybrid', 'onsite'].includes(b.workType) ? b.workType : 'onsite',
      seniority: ['intern', 'junior', 'mid', 'senior', 'staff', 'lead'].includes(b.seniority) ? b.seniority : 'mid',
      salary: b.salary,
      description: b.description,
      skills,
    })
    res.status(201).json({ job })
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors)[0].message })
    }
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router