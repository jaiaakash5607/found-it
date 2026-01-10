const express = require('express');
const {readFileSync} = require('fs');
const path = require('path');  
const bcrypt = require('bcrypt');
const { pool } = require('./db');
const cors = require('cors')  
const  jwtGenerator =  require("./utils/jwtGen.js")
const cookieParser = require('cookie-parser')
const authMiddleware = require("./middleware/auth.js")
const jwt = require("jsonwebtoken")
const {readFileSync} = require("fs")
// const Page = 


const app = express();
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:5173",
  methods:["GET","POST","PUT","DELETE"],
  credentials:true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: false}));



//registration
app.post('/api/register', async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;
    
    if (!full_name || !email || !password) {
      return res.status(400).json({  success:false,error: 'Full name, email and password are required.' });
    }
    
    if (!email.toLowerCase().endsWith('@srmist.edu.in')) {
      return res.status(400).json({ success:false, error: 'Only @srmist.edu.in emails are allowed.' });
    }
    
    const existingUser = await pool.query(
      "SELECT 1 FROM users WHERE email = $1",
      [email]
    );
    
    if (existingUser.rowCount > 0) {
      return res.status(409).json({
        error: "Email already registered",
      });
    }
    
    const passwordHash = await bcrypt.hash(password, 12);
    
    const result = await pool.query(
      `INSERT INTO users (full_name, email, phone, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [full_name, email.toLowerCase(), phone || null, passwordHash]
    );
    
    const token = jwtGenerator(result.rows[0].id);
    
    const user = result.rows[0];
    
    res.cookie("token",token,{
      httpOnly:true,
      secure:false,
      sameSite:"lax",
      maxAge:15 * 60 * 1000
    })

    
    res.status(201).json({success:true,jwt:token})
  } catch (err) {
    console.error('Error in /api/register:', err);

    if (err.code === '23505') {
      return res.status(400).json({success:true, error: 'Email is already registered.' });
    }

    res.status(500).json({ success:false,error: err.message });
  }
});


//login
app.post('/api/login', async (req, res) => {
  console.log(req.cookies)
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success:false,
        error: 'Email and password are required'
      });
    }

    const normalizedEmail = email.toLowerCase();

    
    const result = await pool.query(
      `SELECT id, full_name, email, phone, password_hash, created_at
      FROM users
      WHERE email = $1`,
      [normalizedEmail]
    )
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success:false,
        error: 'Invalid email or password'
      });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
  


    if (!isMatch) {
      return res.status(401).json({
        success:false,
        error: 'Invalid email or password'
      });
    }

    //jwt
    const token = jwtGenerator(user.id)

    //http cookie
    res.cookie("token",token,{
      httpOnly:true,
      secure:false,
      sameSite:"strict",
      maxAge:15 * 60 * 1000
    })
    
    res.status(200).json({success:true,message:"Login successful"})
    delete user.password_hash;

    console.log('User logged in:', user);

  } catch (err) {
    console.error('Error in /api/login:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

//deletion
app.delete("/api/delete",async (req,res)=>{
  const {id} = req.body
  const deleteUser = await pool.query("DELETE * FROM USERS WHERE id=$1",[id])

})

app.get("/me",async (req,res)=>{
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjo2MiwiaWF0IjoxNzY3Nzc1MDEwLCJleHAiOjE3Njc3Nzg2MTB9.7p_iSOMfV0VMpHn2bjGKChvEZsgtehjx3telLqh7xgI"
  const id = jwt.verify(token,process.env.jwt_secret)
  const user = await pool.query("SELECT * FROM USERS WHERE id=$1",[id])
  console.log(id.user)
  res.end()
})


// app.use((req, res) => {
//   res.status(404).send(errorPage);
// });

module.exports = app;
