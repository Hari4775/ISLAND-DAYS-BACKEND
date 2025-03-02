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
    const { name, email} = req.body;

    console.log('Received OTP request for:', { email ,name });

    try {
   
        if (!email || !name) {
            return res.status(400).json({ message: 'enter email and fullname' });
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



const  register= async(req,res)=>{
    try{
        const {name,email,password} = req.body;
       
       // Check if email and phone are whitelisted
       if (!whiteList.emails.includes(email)) {
        return res.status(403).json({
            message: "Signup not allowed. Email is not whitelisted."
        });
      }

    
        const existAdmin= await Admin.findOne({email:email})
        if(existAdmin){
            return res.status(400).json({message:"User already registered. please do Login "})
        }

        const hashedPassword= await bcrypt.hash(password,10);
      
        const admin = new Admin({name,email,password:hashedPassword});
        await admin.save();
        res.json({message: "Admin signup successful",admin});

    }catch(err){
        res.status(400).send("error signup data "+err.message)
        console.log("errorsss")
    }
}


const login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const admin = await Admin.findOne({email:email});
        if(!admin){
            return res.status(400).json({message:"Admin not found. please signup "})
        }
        const isPasswordValid = await admin.validatePassword(password);

        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid password"})
        }
        else{
        const token = await admin.getJWT();
        console.log(token,"token")
        res.cookie("token",token,{
            expired:new Date(Date.now() +8*3600000)
        });

        res.json({message: "Login successful",admin,token});
       }
    }catch(err){
        res.status(400).send("error login data "+err.message)
        console.log("errorsss",err.message)

    }
}


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


const forgotPassword = async(req,res)=>{
    const {email} = req.body;
    
    try{

        if(!email){
            return res.status(400).json({message:"Email is Required"});
        }
        const admin = await Admin.findOne({email: email});
        if(!admin){
            return res.status(200).json({message:"Email is not found"});
        }
        if (!isWhitelisted(email)) {
            return res.status(403).json({ message: 'Access denied. Your email is not allowed.' });
        }

        const otp = generateOtp();
        await sendOtp(email, otp); // Send OTP to the email
        storeOtp(email, otp); // Store OTP for verification

        res.json({ message: 'OTP sent successfully to your email.' });
       
    }catch(err){
        console.error('Error in forgotPassword:', err.message);
        res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }
}


const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Email, OTP, and new password are required.' });
        }

        if (!isWhitelisted(email)) {
            return res.status(403).json({ message: 'Access denied. Your email is not allowed.' });
        }

        if (!verifyStoredOtp(email, otp)) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.status(404).json({ message: 'Email not found.' });
        }

        admin.password = hashedPassword;
        await admin.save();

        res.json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error('Error in resetPassword:', error.message);
        res.status(500).json({ message: 'Failed to reset password. Please try again.' });
    }
};


const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const {token} = req.cookies;
        if(!token){
        throw new Error("Token is invalid")
        }
        const decodeMessage = await jwt.verify(token,jwtSecret);
        const {_id} = decodeMessage;
        const admin = await Admin.findById(_id)

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found.' });
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({ message: 'Invalid current password.' });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        admin.password = hashedNewPassword;
        await admin.save();

        res.json({ message: 'Password changed successfully.' });
    } catch (error) {
        console.error('Error in changePassword:', error.message);
        res.status(500).json({ message: 'Failed to change password. Please try again.' });
    }
};



const verifyOtp = async (req, res) => {
    const {  email, otp} = req.body;

    try {

        if(!email || !otp){
            return res.status(400).json({message:"Email  and  is required"});
        }
        if (!isWhitelisted( email)) {
            return res.status(403).json({ message: 'Access denied. Your email or phone is not allowed.' });
        }

        if (!verifyStoredOtp(email, otp)) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        res.json({ message: 'OTP verified successfully.',  });
    } catch (error) {
        console.error('Error in verifyOtp:', error.message);
        res.status(500).json({ message: 'Failed to verify OTP.' });
    }
};

module.exports = { requestOtp, verifyOtp, register,login,logout,forgotPassword,resetPassword,changePassword };