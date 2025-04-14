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

const bookingInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  bookingNumber: { type: String, required: true },   // Added ✅
  bookingDateTime: { type: String, required: true }  // Added ✅
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  bookingNumber: { type: String, required: true, unique: true },
  bookingDateTime: { type: String, required: true },

  bookingInfo: { type: bookingInfoSchema, required: true }, // With bookingNumber & bookingDateTime added, txnId removed ✅

  passengerDetails: [passengerSchema],

  packageDetails: {
    name: { type: String, required: true },
    category: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    adultCount: { type: Number, required: true },
    childCount: { type: Number, required: true },
    totalAmount: { type: Number },
  },

  paymentDetails: {
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    balanceAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: paymentStatusEnum,
      default: "0%"
    },
    paymentMode: { type: String },         // e.g., 'Razorpay', 'Cash'
    transactionId: { type: String },        // Razorpay TXN ID or Manual Ref #
    transactionImageUrl: { type: String },  // Screenshot or proof of payment
    notes: { type: String }
  }

}, { timestamps: true });

const bookingCounterSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  count: { type: Number, default: 0 },
});

const Booking = mongoose.model("Booking", bookingSchema);
const BookingCounter = mongoose.model("BookingCounter", bookingCounterSchema);

module.exports = {
  Booking,
  BookingCounter
};
