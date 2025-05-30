const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const OTPCollection = mongoose.model("OTPCollection", otpSchema);
module.exports = OTPCollection;