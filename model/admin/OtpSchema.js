const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }, // Auto-delete in 5 min
});

const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;
