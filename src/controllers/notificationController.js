const Notification = require("../models/notificationModel");

exports.sendNotification = async (req, res) => {
  const { message, recipientRole, userId } = req.body;
  try {
    const notification = new Notification({ message, recipientRole, userId });
    await notification.save();

    // Realtime Push
    const io = req.app.get("io");
    if (io) {
      if (recipientRole === "all") {
        io.emit("notify", { message });
      } else if (userId) {
        const socketId = global.userSockets?.[userId];
        if (socketId) io.to(socketId).emit("notify", { message });
      } else {
        (global.userSockets?.[recipientRole] || []).forEach(id =>
          io.to(id).emit("notify", { message })
        );
      }
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getNotifications = async (req, res) => {
  const { role, userId } = req.query;
  const filters = [
    { recipientRole: role },
    { recipientRole: "all" }
  ];
  if (userId) filters.push({ userId });

  const notifications = await Notification.find({ $or: filters }).sort({ createdAt: -1 });
  res.json(notifications);
};
