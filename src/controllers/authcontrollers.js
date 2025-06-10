const LogInCollection = require("../models/loginModel");
const OTPCollection = require("../models/otpModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "yourSecretKey";
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

exports.signup = async (req, res) => {
    try {
        const { fName, lName, email, password, role } = req.body;

        const existingUser = await LogInCollection.findOne({ email });
        if (existingUser) {
            return res.send('<script>alert("User already exists!"); window.history.back();</script>');
        }

        if (!passwordPattern.test(password)) {
            return res.send(
              `<script>alert("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."); 
              window.history.back();
              </script>`);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new LogInCollection({
            fName,
            lName,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();
        return res.redirect("/loginform");
    } catch (error) {
        console.error("Error during signup:", error);
        return res.send('<script>alert("Something went wrong. Please try again later."); window.history.back();</script>');
    }
};


// Login
exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = await LogInCollection.findOne({ email });

        if (!user) {
            return res.send('<script>alert("User not found"); window.history.back();</script>');
        }

        if (user.role !== role) {
            return res.send('<script>alert("Select the proper user type"); window.history.back();</script>');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.send('<script>alert("Wrong password"); window.history.back();</script>');
        }

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "60s" });
        console.log("Generated JWT Token:", token);

        res.cookie('token', token, {
            httpOnly: false,
            secure: false,
            maxAge: 60 * 1000
        });

        if (role === "admin") {
            return res.redirect("/admin/admindashboard");
        } else if (role === "student") {
            return res.redirect("/student/student_home");
        } else if (role === "busincharge") {
            return res.redirect("/bus-incharge/busincharge-dashboard");
        }
    } catch (error) {
        console.error("Error during login:", error);
        return res.send('<script>alert("Something went wrong. Please try again later."); window.history.back();</script>');
    }
};

// Forgot password (generate OTP)
exports.forgpass = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await LogInCollection.findOne({ email });

        if (!user) {
            return res.redirect('/loginform');
        }

        const otp = crypto.randomInt(1000, 9999).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await OTPCollection.create({ email, otp, expiresAt });

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'paaani2004@gmail.com',
                pass: 'adko nuwa nyus ogvp'
            }
        });

        const mailOptions = {
            from: '1nt22cs129.pavani@nmit.ac.in',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}.It is valid for 5 minutes.`
        
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ message: 'Failed to send OTP email!' });
            }
            console.log('OTP email sent: ' + info.response);
            res.redirect('/otp');
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// POST /resetpassword
exports.resetpassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
    if (newPassword !== confirmPassword) {
      return res.render("resetpassword", { message: "Passwords do not match." });
    }

    const user = await LogInCollection.findOne({ email }); // ✅ FIXED
    if (!user) {
      return res.render("resetpassword", { message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.redirect("/loginform");
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).render("resetpassword", { message: "Something went wrong. Try again." });
  }
};





// Middleware - Check token

exports.checkTokenExpiration = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/loginform");  // Ensure this route is properly defined
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Invalid or expired token:", error);
        res.clearCookie("token");
        return res.redirect("/loginform");  // Make sure this is the correct route
    }
};
