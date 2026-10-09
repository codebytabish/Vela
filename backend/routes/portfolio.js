import express from 'express'
import Portfolio from '../models/Portfolio.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()
router.use(requireAuth)

// only http(s) links are allowed, so a link can never be a javascript: URL
const cleanLink = (v) => {
  const s = String(v || '').trim()
  if (!s) return ''
  const withProto = /^https?:\/\//i.test(s) ? s : `https://${s}`
  try {
    const u = new URL(withProto)
    return ['http:', 'https:'].includes(u.protocol) ? u.toString() : null
  } catch {
    return null
  }
}

const fields = (body) => {
  const title = String(body.title || '').trim()
  if (!title) return { error: 'Title is required' }
  const link = cleanLink(body.link)
  if (link === null) return { error: 'Link is not a valid URL' }
  return {
    data: {
      title,
      description: String(body.description || '').trim(),
      tag: String(body.tag || '').trim(),
      link,
    },
  }
}

const fail = (res, err) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors)[0].message })
  }
  if (err.name === 'CastError') return res.status(404).json({ message: 'Not found' })
  console.error(err)
  res.status(500).json({ message: 'Server error' })
}

router.get('/', async (req, res) => {
  try {
    const items = await Portfolio.find({ userId: req.user.id }).sort({ createdAt: 1 })
    res.json({ items })
  } catch (err) {
    fail(res, err)
  }
})

router.post('/', async (req, res) => {
  try {
    const { data, error } = fields(req.body)
    if (error) return res.status(400).json({ message: error })
    const item = await Portfolio.create({ userId: req.user.id, ...data })
    res.status(201).json({ item })
  } catch (err) {
    fail(res, err)
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { data, error } = fields(req.body)
    if (error) return res.status(400).json({ message: error })
    const item = await Portfolio.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      data,
      { new: true, runValidators: true }
    )
    if (!item) return res.status(404).json({ message: 'Not found' })
    res.json({ item })
  } catch (err) {
    fail(res, err)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const result = await Portfolio.deleteOne({ _id: req.params.id, userId: req.user.id })
    if (!result.deletedCount) return res.status(404).json({ message: 'Not found' })
    res.json({ message: 'Deleted' })
  } catch (err) {
    fail(res, err)
  }
})

export default router