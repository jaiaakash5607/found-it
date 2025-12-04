const express = require('express');
const app = express();
const {readFileSync} = require('fs');

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

app.all('*',(req,res)=>{
    res.status(404).send(errorPage)
})



app.listen(5000,()=>{
    console.log("server  listening on port :5000....")
})
