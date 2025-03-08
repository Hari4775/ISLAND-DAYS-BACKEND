const express = require("express");
const cookieparser= require("cookie-parser");
const app= express()
const connectDB = require("../config/connectDB");
const userRoutes= require("../routers/userRoutes/index")
const adminAuthRoutes =require("../routers/adminRoutes");
const cors =require("cors");
const env = require("dotenv");
const port = process.env.PORT;
env.config();

const allowedOrigins = ['https://islanddays.in', 'https://admin.islanddays.in'];


app.use(cookieparser());
app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg =
            "The CORS policy for this site does not allow access from the specified origin.";
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"]
    })
  );
  
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
