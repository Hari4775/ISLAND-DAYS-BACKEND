const mongoose = require("mongoose");

const accommodationSchema = new mongoose.Schema({
  type: String,
  hotel_name: String,
  hotel_image: String,
  rating: String,
  location: String,
  booking_date: Date,
  duration: String
});

module.exports = mongoose.model("Accommodation", accommodationSchema);
