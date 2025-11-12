// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export function requireAuth(req, res, next) {
  try {
    const token = req.cookies.token
    if (!token) return res.status(401).json({ error: 'Unauthorized' })

    const decoded = jwt.verify(token, process.env.SESSION_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    console.error('Auth error:', err.message)
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
