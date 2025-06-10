const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  message: String,
  recipientRole: { type: String, enum: ['admin', 'student', 'busincharge', 'all'] },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'LogInCollection', default: null },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
