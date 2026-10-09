import mongoose from 'mongoose'
import { localDB } from '../config/db.js'

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    company: { type: String, required: true, trim: true, maxlength: 80 },
    location: { type: String, trim: true, maxlength: 80, default: '' },
    workType: { type: String, enum: ['remote', 'hybrid', 'onsite'], default: 'onsite' },
    seniority: { type: String, enum: ['intern', 'junior', 'mid', 'senior', 'staff', 'lead'], default: 'mid' },
    salary: { type: String, trim: true, maxlength: 60, default: '' }, // free text, e.g. "$145–170k"
    description: { type: String, trim: true, maxlength: 4000, default: '' },
    skills: [String],
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isSample: { type: Boolean, default: false },
    requirements: [String],
  },
  { timestamps: true }
)

export default localDB.model('Job', jobSchema)