/**
 * routes/settings.js
 * ------------------
 * Endpoints (all under /api/settings, login required):
 *   GET   /          everything the Settings page shows
 *   PATCH /          save ONE or more sections: { profile }, { links }, { notifications }, { privacy }
 *   POST  /password  change the password (needs the current one)
 *
 * PATCH is "partial": only the sections present in the request body are changed.
 */
import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Settings from '../models/Settings.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()
router.use(requireAuth)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Accepts "github.com/me" or "https://github.com/me". Returns '' for empty, null for invalid.
// Only http(s) links are allowed, so a link can never be a javascript: URL.
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

// Get this user's settings document, creating it with the defaults the first time.
const getSettings = async (userId) => (await Settings.findOne({ userId })) || (await Settings.create({ userId }))

// The exact shape the Settings page receives.
const shape = (user, s) => ({
  accountType: user.accountType,
  plan: 'free', // billing does not exist yet, everyone is on the free plan
  profile: { name: user.name, email: user.email, headline: s.headline || '' },
  links: { github: s.links?.github || '', linkedin: s.links?.linkedin || '' },
  notifications: {
    jobMatches: s.notifications?.jobMatches ?? true,
    applicationUpdates: s.notifications?.applicationUpdates ?? true,
    weeklyDigest: s.notifications?.weeklyDigest ?? false,
  },
  privacy: {
    visibleToRecruiters: s.privacy?.visibleToRecruiters ?? true,
    showPortfolio: s.privacy?.showPortfolio ?? true,
  },
})

// ---------- GET /api/settings ----------
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email accountType')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(shape(user, await getSettings(req.user.id)))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ---------- PATCH /api/settings ----------
router.patch('/', async (req, res) => {
  try {
    const { profile, links, notifications, privacy } = req.body
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    const s = await getSettings(req.user.id)

    // --- Profile tab: name + email live on the User, headline lives in Settings ---
    if (profile) {
      const name = String(profile.name ?? user.name).trim()
      const email = String(profile.email ?? user.email).trim().toLowerCase()
      const headline = String(profile.headline ?? s.headline ?? '').trim()

      if (!name || name.length > 80) return res.status(400).json({ message: 'Name is required (max 80 characters)' })
      if (!EMAIL_RE.test(email)) return res.status(400).json({ message: 'Enter a valid email address' })
      if (headline.length > 120) return res.status(400).json({ message: 'Headline is too long (max 120)' })

      // Email must stay unique across users.
      if (email !== user.email) {
        const taken = await User.exists({ email, _id: { $ne: user._id } })
        if (taken) return res.status(409).json({ message: 'That email is already in use' })
      }

      // updateOne skips any save-hooks on the User model (so the password is never re-hashed by accident).
      await User.updateOne({ _id: user._id }, { name, email })
      user.name = name
      user.email = email
      s.headline = headline
    }

    // --- Connected accounts tab ---
    if (links) {
      const github = cleanLink(links.github)
      const linkedin = cleanLink(links.linkedin)
      if (github === null || linkedin === null) return res.status(400).json({ message: 'One of the links is not a valid URL' })
      s.links = { github, linkedin }
    }

    // --- Notifications / Privacy tabs: copy only real true/false values ---
    if (notifications) {
      for (const key of ['jobMatches', 'applicationUpdates', 'weeklyDigest']) {
        if (typeof notifications[key] === 'boolean') s.notifications[key] = notifications[key]
      }
    }
    if (privacy) {
      for (const key of ['visibleToRecruiters', 'showPortfolio']) {
        if (typeof privacy[key] === 'boolean') s.privacy[key] = privacy[key]
      }
    }

    await s.save()
    res.json(shape(user, s))
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'That email is already in use' })
    if (err.name === 'ValidationError') return res.status(400).json({ message: Object.values(err.errors)[0].message })
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ---------- POST /api/settings/password ----------
router.post('/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Enter your current and new password' })
    if (String(newPassword).length < 8) return res.status(400).json({ message: 'New password must be at least 8 characters' })

    const user = await User.findById(req.user.id)
    // IMPORTANT: a wrong current password answers 400, not 401. A 401 would make the
    // frontend think the login token expired and log the user out.
    if (!user || !(await bcrypt.compare(String(currentPassword), user.password))) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    const hash = await bcrypt.hash(String(newPassword), 10) // same 10 rounds as register
    await User.updateOne({ _id: user._id }, { password: hash })
    res.json({ message: 'Password updated' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router