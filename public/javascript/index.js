require("dotenv").config();
const express = require("express");
const app = express();

const http = require("http");
const path = require("path");
const hbs = require("hbs");
const cors = require("cors");
const nodemailer = require("nodemailer");
const config = require("../../src/config/razorpay");

const bodyParser = require("body-parser");
const mongoose = require("./mongodb");

const authRoutes = require("../../src/routes/authRoutes");
const paymentRoutes = require("../../src/routes/paymentRoutes");

const gpsRoutes = require("../../src/routes/gpsroute");
const templatepath = path.join("template");
const otpRoutes = require("../../src/routes/otpRoutes");
app.use("/api/otp", otpRoutes);

const server = http.createServer(app);
//praser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
//static files location
app.use(express.static(path.join(__dirname, "public")));

//view engine
app.set("view engine", "hbs");
app.set("views", templatepath);

app.use(authRoutes);
app.use(paymentRoutes);
app.use(gpsRoutes);

//app.use(express.static('public'));
//app.use(express.static('static'));
app.use(bodyParser.json());

app.get("/bus-incharge/:page", (req, res) =>
  res.render(`bus-incharge/${req.params.page}`)
);
app.use("/bus-incharge/js", express.static("src/bus-incharge"));
app.use("/images", express.static("public/images"));
app.use("/", express.static("public/css/bus-incharge"));
app.use(express.static("public/css"));
app.use("/js", express.static("public/javascript"));
app.use("/js", express.static("src"));

app.get("/admin/:page", (req, res) => res.render(`admin/${req.params.page}`));
app.use("/admin/js", express.static("src/admin"));
app.use("/images", express.static("public/images"));
app.use("/", express.static("public/css/admin"));
app.use(express.static("public/css"));
app.use("/js", express.static("public/javascript"));
app.use("/js", express.static("src"));

app.get("/admin/:page", (req, res) => res.render(`admin/${req.params.page}`));

app.get("/student/:page", (req, res) =>
  res.render(`student/${req.params.page}`)
);
app.use("/student/js", express.static("public/javascript/student"));
app.use("/images", express.static("public/images"));
app.use("/", express.static("public/css/student"));
app.use(express.static("public/css"));
app.use("/js", express.static("public/javascript"));
app.use("/js", express.static("src"));

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
