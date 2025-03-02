const express =require("express");
const authRouter =require("./AuthRouter")
const profileRouter =require("./profile");
const testRouter = require("./test");
const packageRouter = require("./packages");

const userRoutes =express.Router();

userRoutes.use("/auth",authRouter);
userRoutes.use("/profile",profileRouter);
userRoutes.use("/",testRouter);
userRoutes.use("/packages",packageRouter);

module.exports= userRoutes;