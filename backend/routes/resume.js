import express from 'express'
import Resume from '../models/Resume.js'
import { requireAuth } from '../middleware/auth.js'
import { scoreResume } from '../services/atsScore.js'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import pdf from 'pdf-parse/lib/pdf-parse.js'
import mammoth from 'mammoth'
import { parseResumeText } from '../services/resumeParser.js'
import { buildSuggestions, applySuggestion } from '../services/improve.js'
import { buildSkillsGraph } from '../services/skillsGraph.js'
const router = express.Router()
router.use(requireAuth)

const pick = (b) => ({
  title: b.title, templateId: b.templateId, basics: b.basics, skills: b.skills,
  experience: b.experience, education: b.education, projects: b.projects,
  target: b.target,
})

router.get('/', async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort({ updatedAt: -1 })
    res.json({ resumes })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/', async (req, res) => {
  try {
    const resume = await Resume.create({ userId: req.user.id, ...pick(req.body) })
    res.status(201).json({ resume })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      pick(req.body),
      { new: true, runValidators: true }
    )
    if (!resume) return res.status(404).json({ message: 'Resume not found' })
    res.json({ resume })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})


const UPLOAD_DIR = path.resolve('uploads')
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const uploadFile = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /\.(pdf|docx)$/i.test(file.originalname)
    cb(ok ? null : new Error('Only PDF or DOCX files are allowed'), ok)
  },
}).single('file')

async function extractText(file) {
  const ext = path.extname(file.originalname).toLowerCase()
  if (ext === '.pdf') {
    if (file.buffer.subarray(0, 4).toString() !== '%PDF') throw new Error('This file is not a valid PDF')
    const data = await pdf(file.buffer)
    return data.text
  }
  if (file.buffer.subarray(0, 2).toString() !== 'PK') throw new Error('This file is not a valid DOCX')
  const { value } = await mammoth.extractRawText({ buffer: file.buffer })
  return value
}



router.post('/upload', (req, res) => {
  uploadFile(req, res, async (err) => {
    if (err) {
      const msg = err.code === 'LIMIT_FILE_SIZE' ? 'File is larger than 5MB' : err.message
      return res.status(400).json({ message: msg })
    }
    if (!req.file) return res.status(400).json({ message: 'No file received' })

    try {
      const text = (await extractText(req.file)).replace(/\r/g, '')
      if (text.trim().length < 80) {
        return res.status(422).json({
          message: 'Could not read text from this file. Scanned or image-only PDFs are not supported yet.',
        })
      }

      const { warnings, ...data } = parseResumeText(text)

      const stored = `${crypto.randomUUID()}${path.extname(req.file.originalname).toLowerCase()}`
      await fs.promises.writeFile(path.join(UPLOAD_DIR, stored), req.file.buffer)

      const resume = await Resume.create({
        userId: req.user.id,
        title: req.file.originalname.replace(/\.[^.]+$/, ''),
        source: 'upload',
        fileName: req.file.originalname,
        filePath: stored,
        ...data,
      })
      res.status(201).json({ resume, warnings })
    } catch (e) {
      console.error(e)
      res.status(422).json({ message: e.message || 'Could not parse this file' })
    }
  })
})



// re-score the current resume and return suggestions
router.post('/:id/analyze', async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id })
    if (!resume) return res.status(404).json({ message: 'Resume not found' })

    const r = resume.toObject()
    const ats = scoreResume(r, r.target || {})
    resume.ats = ats
    resume.atsScore = ats.score
    await resume.save()

    res.json({ resume, suggestions: buildSuggestions(r, ats) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// apply one suggestion, then re-score
router.post('/:id/apply', async (req, res) => {
  try {
    const { id, value } = req.body
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id })
    if (!resume) return res.status(404).json({ message: 'Resume not found' })

    const r = resume.toObject()
    if (!applySuggestion(r, String(id || ''), value)) {
      return res.status(400).json({ message: 'Could not apply this suggestion' })
    }
    resume.skills = r.skills
    resume.experience = r.experience
    resume.education = r.education
    resume.projects = r.projects

    const next = resume.toObject()
    const ats = scoreResume(next, next.target || {})
    resume.ats = ats
    resume.atsScore = ats.score
    await resume.save()

    res.json({ resume, suggestions: buildSuggestions(next, ats) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})


router.get('/:id/skills-graph', async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id })
    if (!resume) return res.status(404).json({ message: 'Resume not found' })
    res.json({ graph: buildSkillsGraph(resume.toObject()) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// add one skill to the resume (used by "Add" on the skills graph)
router.post('/:id/skills', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim()
    if (!name || name.length > 40) return res.status(400).json({ message: 'Invalid skill name' })

    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id })
    if (!resume) return res.status(404).json({ message: 'Resume not found' })

    if (!resume.skills.some((s) => s.toLowerCase() === name.toLowerCase())) resume.skills.push(name)

    const r = resume.toObject()
    const ats = scoreResume(r, r.target || {})
    resume.ats = ats
    resume.atsScore = ats.score
    await resume.save()

    res.json({ graph: buildSkillsGraph(resume.toObject()) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})


router.post('/:id/score', async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id })
    if (!resume) return res.status(404).json({ message: 'Resume not found' })
    const r = resume.toObject()
    const ats = scoreResume(r, r.target || {})
    resume.ats = ats
    resume.atsScore = ats.score
    await resume.save()
    res.json({ resume })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})


router.delete('/:id', async (req, res) => {
  try {
    const result = await Resume.deleteOne({ _id: req.params.id, userId: req.user.id })
    if (!result.deletedCount) return res.status(404).json({ message: 'Resume not found' })
    res.json({ message: 'Deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router