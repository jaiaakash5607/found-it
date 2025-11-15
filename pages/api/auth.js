// api/auth.js
import { json } from 'micro'; // micro is small; but you can use plain Node
// If you prefer not to add micro, use node's req/res; below I use plain node-compatible code.

import { registerUser, checkCredentials } from './lib/authHandlers.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      // For example: /api/auth?action=register or ?action=login
      const url = new URL(req.url, `http://${req.headers.host}`);
      const action = url.searchParams.get('action') || 'login';
      // parse body
      const body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => (data += chunk));
        req.on('end', () => {
          try { resolve(JSON.parse(data || '{}')); } catch (e) { resolve({}); }
        });
        req.on('error', reject);
      });

      if (action === 'register') {
        const user = await registerUser(body);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, user }));
        return;
      }

      // default: login
      const user = await checkCredentials(body);
      if (!user) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'Invalid credentials' }));
        return;
      }
      const token = jwt.sign({ sub: user.id }, process.env.SESSION_SECRET, { expiresIn: '7d' });
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=${7*24*60*60}`
      });
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    // not allowed
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }));
  } catch (err) {
    console.error(err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'Server error' }));
  }
}
