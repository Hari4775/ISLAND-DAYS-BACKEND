const express = require("express")
const cookieparser= require("cookie-parser");

const app= express()
const connectDB = require("../config/connectDB");
const userRoutes= require("../routers/userRoutes/index")
const adminAuthRoutes =require("../routers/adminRoutes");

const cors =require("cors");
const env = require("dotenv");
const port = process.env.PORT;
const allowedOrigins = ["https://islandays.onrender.com/*","https://islandays.onrender.com/admin*"]

env.config();
app.use(cookieparser());
app.use(cors());
app.use(express.json({ limit: '2gb' }));
app.use(express.urlencoded({ limit: '2gb', extended: true }));

app.use("/api",userRoutes);

app.use("/api/admin",adminAuthRoutes);

connectDB()
.then(()=>{
    console.log("data base connection established",port)
    app.listen(port,()=>{
        console.log("server is connected")
    })

})
