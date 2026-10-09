import mongoose from 'mongoose'
import { localDB, atlasDB } from '../config/db.js'
const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: 'My Resume' },
    templateId: { type: String, default: 'classic' },

    basics: {
      name: String, title: String, location: String,
      email: String, portfolio: String, summary: String,
    },
    skills: [String],
    experience: [{ _id: false, company: String, role: String, dates: String, description: String }],
    education:  [{ _id: false, school: String, degree: String, dates: String }],
    projects:   [{ _id: false, name: String, link: String, tech: String, description: String }],
    target: { jobTitle: String, company: String, jobDescription: String },
    ats: { type: mongoose.Schema.Types.Mixed },
    source: { type: String, enum: ['builder', 'upload'], default: 'builder' },
    fileName: String,
    filePath: String,

    atsScore: Number,
    embedding: { type: [Number], select: false },
  },
  { timestamps: true }
)

const Resume = localDB.model('Resume', resumeSchema)
export const ResumeAtlas = atlasDB.model('Resume', resumeSchema)
export default Resume