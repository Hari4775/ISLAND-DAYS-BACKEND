const express =require("express");
const {requestOtp, login, register, logout, forgotPassword, resetPassword, changePassword, verifyOtp } = require("../../controllers/admin/auth/authController");
const authRouter =express.Router();
const adminAuth = require("../../middleware/Auth/adminAuthMiddleware");

authRouter.post("/request_otp",requestOtp);
authRouter.post("/verify_otp",verifyOtp)
authRouter.post("/logout",logout);   
module.exports = authRouter;