// models/Booking.js

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bookingNumber: { type: String, required: true, unique: true },
  bookingDateTime: { type: String, required: true },
  bookingInfo: { type: Object, required: true },
  passengerDetails: { type: Object, required: true },
  paymentStatus: { type: String, enum: ["not_paid", "paid"], default: "not_paid" },
  packageDetails: {
    name: { type: String, required: true },
    category: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    adultCount: { type: Number, required: true },
    childCount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
  },
  status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
