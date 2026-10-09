import mongoose from 'mongoose'
import { localDB, atlasDB } from '../config/db.js'
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true, //  stores the HASHED password
    },
    accountType: {
      type: String,
      enum: ['candidate', 'employer'],
      required: true,
    },
    
    companyName: {
      type: String,
    },
    industry: {
      type: String,
    },
    
    isOrgAdmin: {
      type: Boolean,
      default: function () {
        return this.accountType === 'employer'
      },
    },
  },
  { timestamps: true } 
)

export const UserAtlas = atlasDB.model('User', userSchema)
const UserLocal = localDB.model('User', userSchema)

export default UserLocal