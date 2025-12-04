const express = require('express');
const {readFileSync} = require('fs');
const path = require('path');  
const bcrypt = require('bcrypt');
const { pool } = require('./db');   // 👈 import Postgres pool

const app = express();
const pagesDir = path.join(__dirname, 'pages');

// Middleware to parse JSON request bodies
app.use(express.json());

const homePage = readFileSync('./pages/index.html', 'utf-8');
const loginPage = readFileSync('./pages/login.html', 'utf-8');
const registerPage = readFileSync('./pages/register.html', 'utf-8');
const browserPage = readFileSync('./pages/browse.html', 'utf-8');
const errorPage = readFileSync('./pages/err.html', 'utf-8');

app.get('/', (req, res) => {
    res.send(homePage);
});

app.get('/login', (req, res) => {
    res.send(loginPage);
    
});

app.get('/register',(req,res) =>{
    res.status(200).send(registerPage)
})

app.get('/browse',(req,res)=>{
    res.status(200).send(browserPage)
})

// app.all('*',(req,res)=>{
//     res.status(404).send(errorPage)
//     res.status(404).send(errorPage)
// })



// app.listen(5000,()=>{
//     console.log("server  listening on port :5000....")
// })

// 🔐 REGISTER ENDPOINT — this is what actually inserts into Postgres
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Full name, email and password are required.' });
    }

    if (!email.toLowerCase().endsWith('@srmist.edu.in')) {
      return res.status(400).json({ error: 'Only @srmist.edu.in emails are allowed.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, phone, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, email, phone, created_at`,
      [fullName, email.toLowerCase(), phone || null, passwordHash]
    );

    const user = result.rows[0];

    res.status(201).json({
      message: 'User registered successfully',
      user
    });
  } catch (err) {
    console.error('Error in /api/register:', err);

    if (err.code === '23505') {
      // duplicate email
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});


// If you're using Vercel: export app
module.exports = app;

// If you're running locally with node app.js instead of serverless, you’d do:
// app.listen(5000, () => console.log('Server listening on port 5000'));
// but for Vercel, keep only module.exports = app;

module.exports = app;