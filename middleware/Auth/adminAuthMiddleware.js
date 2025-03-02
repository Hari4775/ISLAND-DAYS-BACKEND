const jwt = require("jsonwebtoken");
const User = require("../../model/user");
const env = require("dotenv")
const bcrypt =require("bcrypt");
const user = require("../../model/user");
const adminRouter = require("../../routers/adminRoutes");

env.config()

const jwtSecret = process.env.adminjwtKEY;

const adminAuth = async (req,res,next)=>{

try{
   const {token} = req.cookies;
   if(!token){
    throw new Error("Token is invalid")
   }
   const decodeMessage = await jwt.verify(token,jwtSecret);
   const {_id} = decodeMessage;
   const admin = await User.findById(_id)
   if(!adminRouter){
    throw new Error("Admin is not available")
   }
   req.admin = admin;
   next()

}catch(err){
    res.status(400).send("err"+err.message)
}
}

module.exports = adminAuth;