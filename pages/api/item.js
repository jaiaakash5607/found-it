// api/items.js
const { getItems } = require('./lib/items-controller'); // or convert logic inline
const db = require('./db');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const items = await db.getItems(); // adapt to your db API
      return res.status(200).json(items);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }
  // other methods
  res.setHeader('Allow', 'GET,POST');
  return res.status(405).end('Method Not Allowed');
};
