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
    const { email, password } = req.body;

    const lowerEmail = email.toLowerCase();
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [lowerEmail]);

    if (result.rowCount === 0)
      return res.status(400).json({ error: 'Invalid credentials' });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch)
      return res.status(400).json({ error: 'Invalid credentials' });

    const token = createToken({ id: user.id, email: user.email });

    setTokenCookie(res, token);

    return res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
