import express from 'express'
import Resume from '../models/Resume.js'
import Portfolio from '../models/Portfolio.js'
import { requireAuth } from '../middleware/auth.js'
import { buildContext, overview, answer, detectIntent, QUESTIONS } from '../services/careerAdvice.js'

const router = express.Router()
router.use(requireAuth)

const load = async (userId) => {
  const resume = await Resume.findOne({ userId }).sort({ updatedAt: -1 })
  if (!resume) return null
  const portfolioCount = await Portfolio.countDocuments({ userId })
  return buildContext(resume.toObject(), portfolioCount)
}

router.get('/overview', async (req, res) => {
  try {
    const ctx = await load(req.user.id)
    if (!ctx) return res.json({ hasResume: false })
    res.json({ hasResume: true, intro: overview(ctx), paths: ctx.pathCards, questions: QUESTIONS })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/ask', async (req, res) => {
  try {
    const ctx = await load(req.user.id)
    if (!ctx) return res.status(404).json({ message: 'Build or upload a resume first' })
    const text = String(req.body.message || '').slice(0, 300)
    const intent = QUESTIONS.some((q) => q.id === req.body.intent) ? req.body.intent : detectIntent(text)
    res.json({ reply: answer(ctx, intent) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router