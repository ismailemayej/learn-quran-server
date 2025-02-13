const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  education: { type: String, required: true },
  currentStatus: { type: String, required: true },
  qualification: { type: String, required: true },
  year: { type: String, required: true },
  courseName: { type: String, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
