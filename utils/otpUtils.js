// utils/otpUtils.js
const nodemailer = require('nodemailer');

const otpStorage = {};


const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const storeOtp = (email, otp) => {
  otpStorage[email] = otp;
  console.log(otpStorage,"store otp storage")
};


const verifyStoredOtp = (email, otp) => {
  return otpStorage[email] === otp;
};


const sendOtp = async (email, otp) => {
  console.log(process.env.EMAIL_USER,  process.env.EMAIL_PASS)
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    html: `
        <div style="font-family: Arial, sans-serif; text-align: center; color: #333; background-color:#808080; padding: 20px;">
            <h2 style="font-weight: bold; font-size: 40px; color: black;">ISLAND DAYS</h2>

        <div style="background-color: white; width: 70%; margin: 0 auto; padding: 20px; border-radius: 10px;">
      
        <div style=" margin: 20px 0; ">
          <p style="margin-top:20px">Here is Your One Time Password</p>  
          <h1 style="margin-top:10px; font-weight: bold;"> ${otp}</h1>
          <p>This code is valid for 5 minutes.</p>
        </div>
      
      </div>
    </div>

      `,
      };

  await transporter.sendMail(mailOptions);
};




module.exports = { generateOtp, sendOtp, storeOtp, verifyStoredOtp };