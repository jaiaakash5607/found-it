const jwt = require("jsonwebtoken")
require('dotenv').config()

function authMiddleware(req,res,next){
    const token = req.cookies.token
    console.log(req.cookies)

    if (!token){
        return res.status(401).json({error:"Not Authorized"})
    }

    try {
        req.user = jwt.verify(token,process.env.jwt_secret)
        next();

    } catch (err) {
        console.error(err.message)
        return res.status(403).json({error:"Invalid or expired token"})
    }
}


module.exports = authMiddleware










