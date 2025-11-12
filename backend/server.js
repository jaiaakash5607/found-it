// backend/server.js
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'

dotenv.config()

if (!process.env.SESSION_SECRET) {
  console.error('❌ SESSION_SECRET missing in .env')
  process.exit(1)
}

const app = express()
const PORT = process.env.PORT || 5000

// ✅ Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

// ✅ Routes
app.use('/api/auth', authRoutes)

// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
