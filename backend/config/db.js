import 'dotenv/config'
import mongoose from 'mongoose'

export const localDB = mongoose.createConnection(
  process.env.LOCAL_URI || 'mongodb://127.0.0.1:27017/resume_matcher'
)
export const atlasDB = mongoose.createConnection(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 8000,
})

localDB.on('connected', () => console.log('Local connected:', localDB.name))
atlasDB.on('connected', () => console.log('Atlas connected:', atlasDB.name))
localDB.on('error', (e) => console.error('Local error:', e.message))