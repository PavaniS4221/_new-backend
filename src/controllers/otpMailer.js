const nodemailer = require("nodemailer");
const LogInCollection = require("../models/loginModel");

const otpStore = new Map(); // In-memory OTP store

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await LogInCollection.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = generateOTP();
  otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 }); // 5 min expiry

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "no_reply@gmail.com",        // 🔐 use your email
      pass: "abcd efgh ijkl mnop",           // 🔐 use app password, not your actual password
    },
  });

  const mailOptions = {
    from: "no_reply@gmail.com",
    to: email,
    subject: "Your OTP for password reset",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;
  const data = otpStore.get(email);

  if (!data) return res.status(400).json({ message: "No OTP found" });
  if (Date.now() > data.expires) return res.status(400).json({ message: "OTP expired" });
  if (data.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

  otpStore.delete(email);
  req.session.resetEmail = email; // ✅ store email in session
  res.redirect("/resetpassword"); // go to reset password page
};

