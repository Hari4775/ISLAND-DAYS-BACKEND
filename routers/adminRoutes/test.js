const express =require("express");
const testRouter =express.Router();

testRouter.get("/test",async(req,res)=>{
    try{
       res.send("ITS A ADMIN  URL TESTING")
    }catch(err){
        res.status(400).send("err"+err.message)
    }
})

module.exports = testRouter;