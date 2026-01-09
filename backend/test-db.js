// test-db.js
const { pool } = require('./db');

async function test() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('DB TIME:', result.rows[0]);
  } catch (err) {
    console.error('DB ERROR:', err);
  } finally {
    await pool.end();
  }
}

test();
