/**
 * models/Application.js
 * ---------------------
 * One document = one job application made by one candidate.
 *
 * Two kinds of applications are stored here:
 *   1. Applied through Vela -> has a `jobId` (points to a Job). Title/company are copied from the job.
 *   2. Added by hand        -> no `jobId`. The candidate typed the title and company (job found elsewhere).
 *
 * Status flow:  applied -> interviewing -> offer -> closed
 * A "closed" application also stores WHY: rejected (company said no), declined (you said no),
 * or withdrawn (you pulled out).
 */
import mongoose from 'mongoose'
import { localDB } from '../config/db.js'

// Exported so the routes can validate incoming values against the same lists.
export const APPLICATION_STATUSES = ['applied', 'interviewing', 'offer', 'closed']
export const CLOSED_REASONS = ['rejected', 'declined', 'withdrawn']

const applicationSchema = new mongoose.Schema(
  {
    // Owner of this application. Every query filters by this so users only see their own.
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    // Only set for applications made through Vela.
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },

    // The resume the candidate had when applying (a recruiter will use this later).
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },

    // Copied from the job (or typed by hand) so the card still works if the job is later removed.
    title: { type: String, required: true, trim: true, maxlength: [120, 'Job title is too long (max 120)'] },
    company: { type: String, required: true, trim: true, maxlength: [80, 'Company name is too long (max 80)'] },

    status: { type: String, enum: APPLICATION_STATUSES, default: 'applied' },
    closedReason: { type: String, enum: [...CLOSED_REASONS, ''], default: '' },

    // Dates shown on the cards:
    appliedAt: { type: Date, default: Date.now }, // "Applied Jul 30"
    interviewAt: Date,                            // "Interview Aug 4"
    statusAt: { type: Date, default: Date.now },  // when it entered its current status (offer/closed dates)

    note: { type: String, trim: true, maxlength: [500, 'Note is too long (max 500)'], default: '' },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
)

// A user can apply to the same Vela job only once.
// "partial" means the rule only applies to documents that HAVE a jobId, so hand-added
// applications (no jobId) are never blocked by it.
applicationSchema.index(
  { userId: 1, jobId: 1 },
  { unique: true, partialFilterExpression: { jobId: { $type: 'objectId' } } }
)

export default localDB.model('Application', applicationSchema)