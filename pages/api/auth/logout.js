import { clearTokenCookie } from '../../../lib/cookies';

export default function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  clearTokenCookie(res);
  return res.json({ message: 'Logged out successfully' });
}
