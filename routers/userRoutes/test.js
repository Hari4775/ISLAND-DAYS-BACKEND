const express= require("express");
const testRouter = express.Router();

testRouter.get("/test",async(req,res)=>{
    try{
        res.send("TESTING URL FOR USER")

    }catch(err){
        res.status(400).send("erro"+err.message)
    }
})


module.exports= testRouter;


