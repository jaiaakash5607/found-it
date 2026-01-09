const jwt = require('jsonwebtoken')
require('dotenv').config()

function jwtGenerator(user_id){
    const payload = {
        user:user_id,
    }
    if (!process.env.jwt_secret ){
        throw new Error("jwt_secret is not defined")
    }

    return jwt.sign(payload,process.env.jwt_secret,{expiresIn:"60m"})
}

module.exports = jwtGenerator;  