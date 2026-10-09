import mongoose from 'mongoose'
import { localDB } from '../config/db.js'

const portfolioSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: [120, 'Title is too long (max 120)'] },
    description: { type: String, trim: true, maxlength: [1000, 'Description is too long (max 1000)'], default: '' },
    tag: { type: String, trim: true, maxlength: [30, 'Tag is too long (max 30)'], default: '' },
    link: { type: String, trim: true, maxlength: [300, 'Link is too long'], default: '' },
  },
  { timestamps: true }
)

export default localDB.model('Portfolio', portfolioSchema)