const express =require("express");
const {requestOtp, login, register, logout, forgotPassword, resetPassword, changePassword, verifyOtp } = require("../../controllers/admin/auth/authController");
const authRouter =express.Router();
const adminAuth = require("../../middleware/Auth/adminAuthMiddleware");

authRouter.post("/request_otp",requestOtp);
authRouter.post("/verify_otp",verifyOtp)
authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post("/logout",logout);   
authRouter.post("/forgot_password",adminAuth, forgotPassword);
authRouter.post("/reset_password",adminAuth, resetPassword);
authRouter.post("/change_password",adminAuth, changePassword);

module.exports = authRouter;