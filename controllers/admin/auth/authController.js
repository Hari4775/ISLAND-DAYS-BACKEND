// controllers/auth/authController.js
const jwt = require('jsonwebtoken');
const whiteList = require("../../../config/whiteList");
const { generateOtp, sendOtp, storeOtp, verifyStoredOtp } = require('../../../utils/otpUtils');
const Admin = require('../../../model/admin/admin');
const bcrypt = require("bcrypt");
const jwtSecret = process.env.adminjwtKEY;

const isWhitelisted = ( email)=>{

    return (
        whiteList.emails.includes( email) || 
        whiteList.phones.includes( email)
    )
};


const requestOtp = async (req, res) => {
    const {email} = req.body;
    console.log('Received OTP request for:', { email});
    try {
   
        if (!email) {
            return res.status(400).json({ message: 'enter email ' });
        }

        if (!isWhitelisted( email)) {
            return res.status(403).json({ message: 'Access denied. Your email  is not allowed.' });
        }

        const otp = generateOtp();
        await sendOtp( email,otp); // Send OTP to the identifier
        storeOtp( email, otp); // Store OTP with identifier
        res.json({ message: 'OTP sent successfully.' });
    } catch (error) {
        console.error('Error in requestOtp:', error.message);
        res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }
};



const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required." });
        }

        if (!isWhitelisted(email)) {
            return res.status(403).json({ message: "Access denied. Your email is not allowed." });
        }

        if (!verifyStoredOtp(email, otp)) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        // Generate a JWT token upon successful OTP verification
        const token = jwt.sign({ email }, jwtSecret, { expiresIn: "8h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 8 * 3600000, // 8 hours
        });

        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error in verifyOtp:", error.message);
        res.status(500).json({ message: "Failed to verify OTP." });
    }
};





const logout = async(req,res)=>{
    try{
        res.cookie("token",null,{
            expires:new Date(Date.now())
        })
        res.send("Log out successfully")
    }catch(err){
        res.status(400).send("error login data "+err.message)
        console.log("errorsss",err.message)

    }
}










module.exports = { requestOtp, verifyOtp,logout };