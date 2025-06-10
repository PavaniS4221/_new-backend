const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontrollers");

// Public Pages
router.get("/", (req, res) => res.render("home"));
router.get("/home", (req, res) => res.render("home"));
router.get("/loginform", (req, res) => res.render("loginform"));
router.get("/routelist", (req, res) => res.render("routelist"));
router.get("/contact", (req, res) => res.render("contact"));
router.get("/about", (req, res) => res.render("about"));
router.get("/gpstracker", (req, res) => res.render("gpstracker"));
router.get("/otp", (req, res) => res.render("otp"));
router.get("/forgpass", (req, res) => res.render("forgpass"));

// Reset Password Page (with email from session)
router.get("/resetpassword", (req, res) => {
  const email = req.session.resetEmail;
  if (!email) {
    return res.redirect("/forgpass");
  }
  res.render("resetpassword", { email });
});

// Auth Actions
router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/forgpass", authController.forgpass);
router.post("/resetpassword", authController.resetpassword);

module.exports = router;
