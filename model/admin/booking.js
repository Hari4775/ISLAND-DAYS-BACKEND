const mongoose = require("mongoose");

const documentStatusEnum = [
    "not_uploaded",   // No file uploaded yet
    "uploaded",       // File uploaded by user
    "under_review",   // Admin is reviewing it
    "approved",       // Approved by admin
    "rejected"        // Rejected by admin
  ];
  const paymentStatusEnum = ["0%", "25%", "50%", "100%"];

const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  aadhaarPhoto: { type: String, required: true },
  passportPhoto: { type: String, required: true },
  guardianName: { type: String, required: true },
  guardianPhone: { type: String, required: true },
  policeClearanceCertificate: {
    status: { type: String, enum: documentStatusEnum, default: "not_uploaded" },
    documentUrl: { type: String },
  },
  permit: {
    status: { type: String, enum: documentStatusEnum, default: "not_uploaded" },
    documentUrl: { type: String },
  }
  
});

const bookingSchema = new mongoose.Schema({
  bookingNumber: { type: String, required: true, unique: true },
  bookingDateTime: { type: String, required: true },
  bookingInfo: { type: Object, required: true },

  passengerDetails: [passengerSchema], // 🧍 Array of passengers

  packageDetails: {
    name: { type: String, required: true },
    category: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    adultCount: { type: Number, required: true },
    childCount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
  },

  paymentStatus: {
    type: String,
    enum: paymentStatusEnum,
    default: "0%"
  },

}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
