import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../../../lib/db';
import { setTokenCookie } from '../../../lib/cookies';

function createToken(payload) {
  return jwt.sign(payload, process.env.SESSION_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '3d'
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password)
      return res.status(400).json({ error: 'All fields required' });

    const lowerEmail = email.toLowerCase();
    if (!lowerEmail.endsWith('@srmist.edu.in'))
      return res.status(400).json({ error: 'Only @srmist.edu.in emails allowed' });

    const hash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      'INSERT INTO users (fullname, email, password_hash) VALUES ($1, $2, $3) RETURNING id, fullname, email',
      [fullname, lowerEmail, hash]
    );

    const user = result.rows[0];
    const token = createToken({ id: user.id, email: user.email });

    setTokenCookie(res, token);

    return res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ error: 'Email already registered' });

    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
