// backend/db.js
import pkg from 'pg'
const { Pool } = pkg
import dotenv from 'dotenv'
dotenv.config()

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL missing in .env')
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // set to { rejectUnauthorized: false } if using hosted DB (like Render)
})

pool.on('connect', () => console.log('✅ Connected to PostgreSQL'))
