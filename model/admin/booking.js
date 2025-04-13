// models/Booking.js

const mongoose = require("mongoose");

// Updated statuses
const extendedStatusEnum = [
    "initiated",    // default after booking
    "requested",    // user/admin requested process
    "processed",    // in process
    "approved",     // successfully cleared
    "rejected"      // not cleared
  ];

const bookingSchema = new mongoose.Schema({
  bookingNumber: { type: String, required: true, unique: true },
  bookingDateTime: { type: String, required: true },
  bookingInfo: { type: Object, required: true },
  passengerDetails: { type: Object, required: true },
  packageDetails: {
    name: { type: String, required: true },
    category: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date},
    adultCount: { type: Number,required:true},
    childCount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
  },
  paymentStatus: {
    type: String,
    enum: ["not_received", "partial_received", "fully_received"],
    default: "not_received"
  },
  status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
  policeClearanceCertificate: {
    type: String,
    enum: extendedStatusEnum,
    default: "initiated"
  },
  permit: {
    type: String,
    enum: extendedStatusEnum,
    default: "initiated"
  }

}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
