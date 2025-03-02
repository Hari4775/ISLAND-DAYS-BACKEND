const mongoose = require("mongoose");

const travelSchema = new mongoose.Schema({
  mode: String,
  from: String,
  to: String,
  duration: String
});

module.exports = mongoose.model("Travel", travelSchema);
