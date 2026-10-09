// routes/auth.js
import { requireAuth } from '../middleware/auth.js'
import jwt from 'jsonwebtoken'
import express from 'express'
import bcrypt from 'bcryptjs'
import User, { UserAtlas } from '../models/User.js'

const router = express.Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, accountType, companyName, industry } = req.body

    // Basic validation
    if (!name || !email || !password || !accountType) {
      return res.status(400).json({ message: 'name, email, password and accountType are required' })
    }
    if (!['candidate', 'employer'].includes(accountType)) {
      return res.status(400).json({ message: 'accountType must be candidate or employer' })
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }
    if (accountType === 'employer' && !companyName) {
      return res.status(400).json({ message: 'companyName is required for employers' })
    }

    // Duplicate check
    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

       const data = {
      name,
      email,
      password: hashedPassword,
      accountType,
      ...(accountType === 'employer' && { companyName, industry }),
    }

    const user = await User.create(data)   // local DB
    await UserAtlas.create(data)           // Atlas

    const token = jwt.sign(
      { id: user._id, accountType: user.accountType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    const { password: _, ...safeUser } = user.toObject()
    res.status(201).json({ message: 'User registered', token, user: safeUser })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email already registered' })
    }
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { id: user._id, accountType: user.accountType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    const { password: _, ...safeUser } = user.toObject()
    res.json({ token, user: safeUser })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password')
  if (!user) return res.status(401).json({ message: 'Unauthorized' })
  res.json({ user })
})
router.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: false, path: '/' })
  res.status(200).json({ message: 'Logged out' })
})

export default router