const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  name: String,
  description: String,
  images: [String],
  duration: String,
  time: String
});

module.exports = mongoose.model("Activity", activitySchema);
