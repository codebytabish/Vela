/**
 * routes/applications.js
 * ----------------------
 * Endpoints (all under /api/applications, candidate accounts only):
 *   GET    /       list my applications
 *   POST   /       create one  ({ jobId } to apply to a Vela job, or { title, company } for a manual one)
 *   PATCH  /:id    change status / date / note
 *   DELETE /:id    remove one
 */
import express from 'express'
import Application, { APPLICATION_STATUSES, CLOSED_REASONS } from '../models/Application.js'
import Job from '../models/Job.js'
import Resume from '../models/Resume.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = express.Router()

// 1st check: logged in. 2nd check: the account type is "candidate".
router.use(requireAuth, requireRole('candidate'))

/**
 * Turns "2026-07-30" (from an <input type="date">) into a Date.
 * We store it at 12:00 UTC so it shows as the same calendar day in any timezone.
 * Returns: null = no date given, false = invalid date, Date = valid.
 */
const parseDay = (v) => {
  if (!v) return null
  const d = /^\d{4}-\d{2}-\d{2}$/.test(String(v)) ? new Date(`${v}T12:00:00Z`) : new Date(v)
  return Number.isNaN(d.getTime()) ? false : d
}

/**
 * Moves an application to `status` and updates the right date field:
 *   applied      -> `when` is the date applied
 *   interviewing -> `when` is the interview date
 *   offer/closed -> `when` is the date it happened
 * If no date is given and the status really changed, "now" is used.
 * Mutates `app` (the caller saves it).
 */
function applyStatus(app, status, when, reason) {
  const changed = status !== app.status
  app.status = status

  if (status === 'applied') {
    if (when) { app.appliedAt = when; app.statusAt = when }
    else if (changed) app.statusAt = new Date()
  } else if (status === 'interviewing') {
    if (when) app.interviewAt = when
    if (changed) app.statusAt = new Date()
  } else {
    if (when) app.statusAt = when
    else if (changed) app.statusAt = new Date()
  }

  // Only closed applications carry a reason. Default to "withdrawn" if none was sent.
  app.closedReason = status === 'closed' ? (CLOSED_REASONS.includes(reason) ? reason : 'withdrawn') : ''
}

// One place to turn database errors into friendly HTTP answers.
const fail = (res, err) => {
  if (err.code === 11000) return res.status(409).json({ message: 'You already applied to this job' })
  if (err.name === 'ValidationError') return res.status(400).json({ message: Object.values(err.errors)[0].message })
  if (err.name === 'CastError') return res.status(404).json({ message: 'Not found' })
  console.error(err)
  res.status(500).json({ message: 'Server error' })
}

// ---------- GET /api/applications ----------
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id }).sort({ statusAt: -1 })
    res.json({ applications })
  } catch (err) {
    fail(res, err)
  }
})

// ---------- POST /api/applications ----------
router.post('/', async (req, res) => {
  try {
    const { jobId, title, company, note, closedReason } = req.body
    const status = req.body.status || 'applied'
    if (!APPLICATION_STATUSES.includes(status)) return res.status(400).json({ message: 'Invalid status' })

    const when = parseDay(req.body.date)
    if (when === false) return res.status(400).json({ message: 'Invalid date' })

    // Where do title/company come from?
    let data
    if (jobId) {
      // Applying to a Vela job: copy the details from the job itself, never trust the browser.
      const job = await Job.findOne({ _id: jobId, status: 'open' }).lean()
      if (!job) return res.status(404).json({ message: 'Job not found' })
      data = { jobId: job._id, title: job.title, company: job.company }
    } else {
      // Added by hand: the candidate typed them.
      const t = String(title || '').trim()
      const c = String(company || '').trim()
      if (!t || !c) return res.status(400).json({ message: 'Title and company are required' })
      data = { title: t, company: c }
    }

    // Remember which resume was current at the time of applying.
    const latest = await Resume.findOne({ userId: req.user.id }).sort({ updatedAt: -1 }).select('_id')

    const doc = new Application({
      userId: req.user.id,
      resumeId: latest?._id,
      ...data,
      note: String(note || '').trim(),
    })
    applyStatus(doc, status, when, closedReason)
    await doc.save()

    res.status(201).json({ application: doc })
  } catch (err) {
    fail(res, err)
  }
})

// ---------- PATCH /api/applications/:id ----------
router.patch('/:id', async (req, res) => {
  try {
    // The userId filter means you can only edit your own applications.
    const app = await Application.findOne({ _id: req.params.id, userId: req.user.id })
    if (!app) return res.status(404).json({ message: 'Not found' })

    const { status, closedReason, note, title, company } = req.body
    const when = parseDay(req.body.date)
    if (when === false) return res.status(400).json({ message: 'Invalid date' })

    if (typeof note === 'string') app.note = note.trim()

    // Title/company can only be edited for hand-added applications.
    // For Vela jobs they come from the job and stay fixed.
    if (!app.jobId) {
      if (typeof title === 'string' && title.trim()) app.title = title.trim()
      if (typeof company === 'string' && company.trim()) app.company = company.trim()
    }

    // Status and/or date changed?
    if (status !== undefined || when) {
      const next = status ?? app.status
      if (!APPLICATION_STATUSES.includes(next)) return res.status(400).json({ message: 'Invalid status' })
      applyStatus(app, next, when, closedReason)
    }

    await app.save()
    res.json({ application: app })
  } catch (err) {
    fail(res, err)
  }
})

// ---------- DELETE /api/applications/:id ----------
router.delete('/:id', async (req, res) => {
  try {
    const result = await Application.deleteOne({ _id: req.params.id, userId: req.user.id })
    if (!result.deletedCount) return res.status(404).json({ message: 'Not found' })
    res.json({ message: 'Deleted' })
  } catch (err) {
    fail(res, err)
  }
})

export default router