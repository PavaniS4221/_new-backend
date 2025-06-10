require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const cors = require('cors');
const nodemailer = require('nodemailer');
const config = require('./config/razorpay');
const bodyParser = require('body-parser');
const mongoose = require('./mongodb');
const session = require('express-session');

// ROUTES
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const gpsRoutes = require('./routes/gpsroute');
const otpRoutes = require("./routes/otpRoutes");
const notificationRoutes = require('./routes/notificationRoutes');

// 📦 Setup view engine and template path
const templatepath = path.join('template');
app.set('view engine', 'hbs');
app.set('views', templatepath);

// ✅ SESSION CONFIGURATION
app.use(session({
  secret: 'yourStrongSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // secure: true for HTTPS
}));

// 🔧 MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

// 🔧 STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static('public/images'));
app.use('/js', express.static('public/javascript'));
app.use('/js', express.static('src'));
app.use('/', express.static('public/css'));
app.use('/admin/js', express.static('public/javascript/admin'));
app.use('/', express.static('public/css/student'));
app.use('/student/js', express.static('public/javascript/student'));
app.use('/', express.static('public/css/student'));
app.use('/bus-incharge/js', express.static('public/javascript/bus-incharge'));
app.use('/', express.static('public/css/bus-incharge'));

// 🌐 ROUTES
app.use("/api/otp", otpRoutes);
app.use(authRoutes);
app.use(paymentRoutes);
app.use(gpsRoutes);
app.use("/api/notifications", notificationRoutes);

// PAGE ROUTES
app.get('/admin/:page', (req, res) => res.render(`admin/${req.params.page}`));
app.get('/student/:page', (req, res) => res.render(`student/${req.params.page}`));
app.get('/bus-incharge/:page', (req, res) => res.render(`bus-incharge/${req.params.page}`));


// ✅ SOCKET.IO SETUP
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // ⚠️ Replace with frontend domain in prod
    methods: ["GET", "POST"]
  }
});

global.userSockets = {};

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("register", ({ userId, role }) => {
    if (userId) global.userSockets[userId] = socket.id;
    if (role) {
      global.userSockets[role] = global.userSockets[role] || [];
      global.userSockets[role].push(socket.id);
    }
    console.log("✅ Registered:", userId || 'no ID', role || 'no role');
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
    for (const key in global.userSockets) {
      if (Array.isArray(global.userSockets[key])) {
        global.userSockets[key] = global.userSockets[key].filter(id => id !== socket.id);
      } else if (global.userSockets[key] === socket.id) {
        delete global.userSockets[key];
      }
    }
  });
});

app.set("io", io); // Make io available in controllers


// ✅ START SERVER
server.listen(4000, () => {
  console.log('🚀 Server + Socket.io running on port 4000');
});
