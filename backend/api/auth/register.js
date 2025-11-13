// api/auth/register.js
import prisma from '../../backend/lib/prisma.js';
import bcrypt from 'bcrypt';

/**
 * Serverless register handler
 * Expects POST { email, password, fullName }
 * Only allows @srmist.edu.in emails (adjust regex if needed)
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { email, password, fullName } = req.body || {};
    console.log('Register attempt:', { email, fullName });

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // enforce SRM email (case-insensitive)
    if (!/^[^@]+@srmist\.edu\.in$/i.test(email)) {
      return res.status(400).json({ error: 'Only @srmist.edu.in emails allowed' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, fullName }
    });

    console.log('Created user id=', user.id, 'email=', user.email);

    // Return safe user object (do not include password)
    return res.status(201).json({ user: { id: user.id, email: user.email, fullName: user.fullName } });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
