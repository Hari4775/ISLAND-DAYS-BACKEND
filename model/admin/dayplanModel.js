const mongoose = require("mongoose");

// Image Schema for Consistency
const imageSchema = new mongoose.Schema({
  image: {
    type: String, // Stores Cloudinary URL
    required: true,
  },
  cloudinaryImageId: {
    type: String, // Stores Cloudinary's Public ID (used for deletion)
    required: true,
  },
});

// Activity Schema
const activitySchema = new mongoose.Schema({
  activity_id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  activity_name: {
    type: String,
  },
  activity_description: {
    type: String,
  },
  activity_images: [imageSchema], // Using image schema
  activity_duration: {
    type: String,
  },
  time: {
    type: String,
  },
});

// Accommodation Schema
const accommodationSchema = new mongoose.Schema({
  accommodation_id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  hotel_name: {
    type: String,
  },
  hotel_type: {
    type: String,
  },
  hotel_images: [imageSchema], // Using image schema
  rating: {
    type: String,
  },
  location: {
    type: String,
  },
  booking_date: {
    type: Date,
  },
  duration: {
    type: String,
  },
});

// Food Schema
const foodSchema = new mongoose.Schema({
  food_id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  food_name: {
    type: String,
  },
  food_description: {
    type: String,
  },
  food_images: [imageSchema], // Using image schema
});

// Trip Plan Schema
const tripPlanSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  plan_id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  day_heading: {
    type: String,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  package_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Packages",
    required: true,
  },
  description: {
    type: String,
  },
  activities: [activitySchema],
  accommodations: [accommodationSchema],
  foods: [foodSchema],
});

const TripPlan = mongoose.model("dayPlan", tripPlanSchema);
module.exports = TripPlan;
