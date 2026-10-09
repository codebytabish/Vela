import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import './config/db.js' // opens both connections
import portfolioRoutes from './routes/portfolio.js'
import careerRoutes from './routes/career.js'
import jobRoutes from './routes/jobs.js'
import applicationRoutes from './routes/applications.js'
import settingsRoutes from './routes/settings.js'



const app = express()

// 1. Middleware first
app.use(cors({
  origin: 'http://localhost:5173', // must be explicit, '*' is not allowed with credentials
  credentials: true,
}))

// 2. Routes after
app.use(express.json()) 
import resumeRoutes from './routes/resume.js'
app.use('/api/resumes', resumeRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/portfolio', portfolioRoutes)
app.use('/api/career', careerRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/settings', settingsRoutes)


app.get('/', (req, res) => {
  res.send('Vela backend running');
});


// 3. Start
app.listen(5000, () => console.log('Server running on port 5000'))