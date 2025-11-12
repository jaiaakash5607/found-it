// backend/routes/auth.js
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../db.js'
import dotenv from 'dotenv'
dotenv.config()

const router = express.Router()

// Helper: sign JWT
function createToken(payload) {
  return jwt.sign(payload, process.env.SESSION_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '3d'
  })
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { fullname, email, password } = req.body

    if (!fullname || !email || !password)
      return res.status(400).json({ error: 'All fields required' })

    // Email validation
    if (!email.endsWith('@srmist.edu.in'))
      return res.status(400).json({ error: 'Only @srmist.edu.in emails allowed' })

    // Password hash
    const hash = await bcrypt.hash(password, 12)

    // Insert into DB
    const result = await pool.query(
      'INSERT INTO users(fullname,email,password_hash) VALUES($1,$2,$3) RETURNING id, fullname, email',
      [fullname, email.toLowerCase(), hash]
    )

    const user = result.rows[0]

    const token = createToken({ id: user.id, email: user.email })
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false, // set true if using HTTPS
      maxAge: 3 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({ message: 'User registered', user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email.toLowerCase()])

    if (result.rowCount === 0)
      return res.status(400).json({ error: 'Invalid credentials' })

    const user = result.rows[0]
    const isMatch = await bcrypt.compare(password, user.password_hash)

    if (!isMatch)
      return res.status(400).json({ error: 'Invalid credentials' })

    const token = createToken({ id: user.id, email: user.email })

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      maxAge: 3 * 24 * 60 * 60 * 1000
    })

    res.json({ message: 'Login successful', user: { id: user.id, fullname: user.fullname, email: user.email } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Logged out successfully' })
})

export default router
