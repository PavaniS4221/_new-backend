const express = require("express");
const router = express.Router();
const { sendNotification, getNotifications } = require("../controllers/notificationController");

router.post("/send", sendNotification);
router.get("/list", getNotifications);

module.exports = router;
