const jwt = require("jsonwebtoken");
const User = require("../model/user");
const env = require("dotenv")
const bcrypt =require("bcrypt");
const user = require("../model/user");

env.config()

const jwtSecret = process.env.jwtKEY;

const userAuth = async (req,res,next)=>{

try{
   const {token} = req.cookies;
   if(!token){
    throw new Error("Token is invalid")
   }
   const decodeMessage = await jwt.verify(token,jwtSecret);
   const {_id} = decodeMessage;
   const user = await User.findById(_id)
   if(!user){
    throw new Error("User is not available")
   }
   req.user = user;
   next()

}catch(err){
    res.status(400).send("err"+err.message)
}
}

module.exports = userAuth;