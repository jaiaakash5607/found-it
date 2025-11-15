// api/auth/me.js
import jwt from 'jsonwebtoken'
import prisma from '../../lib/prisma.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const token = (req.cookies && req.cookies.token) || req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Not authenticated' })

  try {
    const data = jwt.verify(token, process.env.SESSION_SECRET)
    const user = await prisma.user.findUnique({ where: { id: data.userId }, select: { id: true, email: true, name: true } })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ user })
  } catch (err) {
    console.error(err)
    res.status(401).json({ error: 'Invalid token' })
  }
}
