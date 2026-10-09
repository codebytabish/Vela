/**
 * models/Settings.js
 * ------------------
 * Extra per-user settings that do not live on the User model:
 * headline, profile links, notification preferences and privacy choices.
 * One document per user (userId is unique). It is created on first use with the defaults below.
 *
 * Name and email are NOT stored here: they stay on the User document.
 */
import mongoose from 'mongoose'
import { localDB } from '../config/db.js'

const settingsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    headline: { type: String, trim: true, maxlength: 120, default: '' },

    // "Connected accounts" tab: plain profile links, not OAuth connections.
    links: {
      github: { type: String, trim: true, maxlength: 300, default: '' },
      linkedin: { type: String, trim: true, maxlength: 300, default: '' },
    },

    // Preferences are saved here. Sending the actual emails/alerts comes later.
    notifications: {
      jobMatches: { type: Boolean, default: true },          // "Alert me when a role scores above 85%"
      applicationUpdates: { type: Boolean, default: true },  // recruiter replies and status changes
      weeklyDigest: { type: Boolean, default: false },       // weekly summary
    },

    // Recruiters will check these when the recruiter side reads candidate profiles.
    privacy: {
      visibleToRecruiters: { type: Boolean, default: true },
      showPortfolio: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
)

export default localDB.model('Settings', settingsSchema)