const express= require("express");
const profile = express.Router();
const userAuth = require("../../middleware/userAuthMiddleware");
const {validationProfileData} =require("../../utils/validations");

profile.get("/view", userAuth,async(req,res)=>{
    try{
        const user = req.user;
        res.send(user);

    }catch(err){
        res.status(400).send("Profile view  error" +err.message)
    }

})
profile.patch("/edit",userAuth,async(req,res)=>{
    try{
        if(!validationProfileData(req)){
            throw new Error("invalid edit requests");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key)=>(loggedInUser[key] === req.body[key]));
        await loggedInUser.save();
        res.json({
          message:`${loggedInUser.fristName}, Your profile updated successfully`,
          data:loggedInUser
        })

    }catch(err){
        res.status(400).send("err"+err.message)
    }
})

module.exports = profile;