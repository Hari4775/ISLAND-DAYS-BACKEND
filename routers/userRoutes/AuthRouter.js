const express = require("express");
const User= require("../../model/user")
const bcrypt =require("bcrypt");
const authRouter = express.Router();
const {validateSignupData} = require("../../utils/validations");

authRouter.post("/signup",async(req,res)=>{
    try{
      validateSignupData(req) 
       const{fristName,
         lastName,
         email,
         phone,
         age,
         gender,
         password,
         aadarNumber,
         aadarPhotoURL,
         pccPhotoURL,
         photoURL,
         guardiaFristName,
          gurardianLastName,
          guradianphone,
         }=req.body;
      
      const existingUser= await User.findOne({
         $or:[{email}, {phone}]
      });

      if(existingUser){
      if (existingUser.email === email){
         throw new Error("Email already registerd  please try with another email id")
      }
      else if(existingUser.phone === phone){
         throw new Error("phone nnumber already  registerd please try with another phone number")
      }
      }
       console.log(req.body)
       const hashedPassword = await bcrypt.hash(password,10);
       const user = new User ({
         fristName,
         lastName,
         age,
         gender,
         phone, 
         email,
         password:hashedPassword, 
         aadarNumber,
         aadarPhotoURL,
         pccPhotoURL,
         photoURL,
         guardiaFristName,
          gurardianLastName,
          guradianphone,
         });

       await user.save()
    console.log(req.body,"req bodyy")
       res.send("user signup successfully")
        

    }catch(err){
      res.status(400).send("error signup data "+err.message)
      console.log("errorsss")
    }
})

authRouter.post("/login",async(req,res)=>{
   try{
      const {email,password}= req.body;
      const user= await User.findOne({email:email})
      if(!user){
         throw new Error ("invalid user credentials")
      }
      const isPassword = await user.validatePassword(password);
      if(isPassword){
      const token = await user.getJWT();

      res.cookie("token",token,{
         expires:new Date(Date.now() +8*3600000),
      });
      res.send("login successfull")
      }
      else{
         throw new Error("invalid password")
      }

   }catch(err){
      res.status(400).send("error:"+err.message)
   }
})

authRouter.post("/logout",async(req,res)=>{
   try{
       res.cookie("token",null,{
         expires:new Date(Date.now())
       })
      res.send("Log out successfully")
   }catch(err){
      res.status(400).send("Error "+err.message)
   }
})
module.exports = authRouter;