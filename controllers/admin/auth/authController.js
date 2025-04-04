const jwt = require('jsonwebtoken');
const whiteList = require("../../../config/whiteList");
const { sendOtp } = require('../../../utils/otpUtils');
const OTP = require('../../../model/admin/OtpSchema');
const bcrypt = require("bcrypt");
const jwtSecret = process.env.adminJWTkey; // Exact match


const isWhitelisted = (email) => {
    return (
        whiteList.emails.includes(email) || 
        whiteList.phones.includes(email)
    );
};

const requestOtp = async (req, res) => {
    const { email } = req.body;
    console.log('Received OTP request for:', { email });

    try {
        if (!email) {
            return res.status(400).json({ message: 'Enter email' });
        }

        if (!isWhitelisted(email)) {
            return res.status(403).json({ message: 'Access denied. Your email is not allowed.' });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Convert to string

        // Hash the OTP before storing it
        const hashedOtp = await bcrypt.hash(otp, 10);

        // Store hashed OTP in the database
        const otpRecord = await OTP.create({ email, otp: hashedOtp });

        if (!otpRecord) {
            console.error(`❌ OTP storage failed for ${email}`);
            return res.status(500).json({ message: "Failed to store OTP." });
        }

        console.log(`✅ OTP stored in DB for ${email}`);

        // Send the original OTP (not hashed) via email/SMS
        await sendOtp(email, otp); 
        console.log(`📩 OTP sent to ${email}`);

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
        const otpValue = otp.toString();  
        // Fetch the most recent OTP record for this email
        const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });
        if (!otpRecord) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // Compare hashed OTP with the entered OTP
        const isOtpValid = await bcrypt.compare(otpValue, otpRecord.otp);
        if (!isOtpValid) {
            return res.status(400).json({ success: false, message: "Invalid OTP." });
        }

        console.log(`✅ OTP verified for ${email}`);

        // OTP is valid, delete it after verification
        await OTP.deleteOne({ _id: otpRecord._id });

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

const logout = async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now())
        });
        res.send("Log out successfully");
    } catch (err) {
        res.status(400).send("Error logging out: " + err.message);
        console.log("Error:", err.message);
    }
};

module.exports = { requestOtp, verifyOtp, logout };
