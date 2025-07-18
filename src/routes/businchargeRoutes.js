const express = require("express");
const router = express.Router();
const BusCollection = require("../models/busdetailsModel");
const ProfileCollection = require("../models/profileModel");
const PaymentCollection = require("../models/paymentModel");
const businchargeControllers = require("../controllers/businchargecontrollers");
const loginCollection = require("../models/loginModel"); 
const mongoose = require("mongoose");
const MessageCollection = require("../models/Message");
const ContactCollection = require("../models/Contact");
const DriverCollection = require("../models/assign_bus");
const Notification = require("../models/notificationmodel");
//post methods
router.post("/profileupdate", businchargeControllers.uploadMiddleware,businchargeControllers.profileupdate);
router.post("/submitinquiry",businchargeControllers.submitinquiry);







// Middleware: applies to all /bus-incharge/* routes
router.use("/bus-incharge", async (req, res, next) => {
  try {
    const email = req.session?.user?.email;
    const role = req.session?.user?.role;
    if (!email) return res.redirect("/loginform");

    const profile = await ProfileCollection.findOne({ email });

    if (profile?.profileImage?.data) {
      const profileImageBase64 = profile.profileImage.data.toString("base64");
      const profileImageType = profile.profileImage.contentType || "image/jpeg";
      res.locals.profileImageBase64 = profileImageBase64;
      res.locals.profileImageType = profileImageType;
    } else {
      res.locals.profileImageBase64 = null;
      res.locals.profileImageType = "image/jpeg";
    }

    // Fetch notifications
    const notifications = await Notification.find({ recipientRole: role })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.locals.notifications = notifications;
    res.locals.notificationCount = notifications.length;


    next();

  } catch (error) {
    console.error("Bus-incharge profile image middleware error:", error);
    res.status(500).send("Something went wrong");
  }
});



router.get("/bus-incharge/busincharge-dashboard", async (req, res) => {
  try {
    const studentCount = await loginCollection.countDocuments({ role: "student" });
    const teacherCount = await loginCollection.countDocuments({ role: "teacher" });
    const driverCount = await loginCollection.countDocuments({ role: "busincharge" });
    const paidCount=await PaymentCollection.countDocuments({status:"sucess"})
    const unpaidCount=await PaymentCollection.countDocuments({status:"Pending"})
    const allNewUsers = await ProfileCollection.find({
  role: { $in: ["student", "teacher"] }
})
.sort({ createdAt: -1 }) // latest first
.limit(4)                // adjust count as needed
.lean();
const payments = await PaymentCollection
  .find()
  .sort({ createdAt: -1 }) // sort newest first
  .limit(4)
payments.forEach(payment => {
  if (payment.createdAt) {
    const date = new Date(payment.createdAt);
    payment.createdAtFormatted = date.toLocaleDateString('en-GB'); // DD-MM-YYYY
  }
}); 
res.render("./bus-incharge/busincharge-dashboard", { studentCount, teacherCount, driverCount,paidCount,unpaidCount,payments,newUsers:allNewUsers });
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    res.status(500).send("Internal Server Error");
  }
});


router.get("/bus-incharge/profile", async (req, res) => {
  try {
    const email = req.query.email || req.session?.user?.email;
   
    if (!email) return res.redirect("/loginform")
  
    
   const profile = await ProfileCollection.findOne({ email })// Important: .lean() converts it to plain object

  let profileImageBase64 = null;
  let profileImageType = "image/jpeg";
  if (profile?.profileImage?.data) {
      profileImageBase64 = profile.profileImage.data.toString("base64");
      profileImageType = profile.profileImage.contentType || "image/jpeg";
    }
     let driverId = null;
    if (profile?.route_num) {
      const driverDoc = await DriverCollection.findOne({ routeNumber: profile.route_num });
      if (driverDoc) {
        driverId = driverDoc.driverId;
      }
    }
   
    
    res.render("./bus-incharge/profile", { profile,profileImageBase64,profileImageType,driverId });
  } catch (err) {
    console.error("Error loading profile:", err);
    res.status(500).send("Internal Server Error");
  }
});



router.get("/bus-incharge/busdetails", async (req, res) => {
  try {
     const email = req.session?.user?.email;
    if (!email) return res.redirect("/loginform");

    // Step 1: Get bus-incharge's profile
    const profile = await ProfileCollection.findOne({ email });

    if (!profile || !profile.route_num) {
      return res.status(404).send("No assigned route found for this user.");
    }

    const assignedRouteNumber = profile.route_num;
    // Get assigned route number for the busincharge 
    const bus = await BusCollection.findOne({ routeNumber: assignedRouteNumber });
    
  let busImageBase64 = null;
    let busImageType = "image/jpeg";

    if (bus?.image) {
      busImageBase64 = bus.image.toString("base64");
      busImageType = bus.imageType || "image/jpeg";
    }

    res.render("./bus-incharge/busdetails", {
      bus,
      busImageBase64,
      busImageType,
      message: null,
    });
  }   
  catch (error) {
    console.error("Error fetching bus details:", error);
    res.status(500).send("Internal Server Error");
  }
});


router.get("/bus-incharge/view-payments/:ref_id", async (req, res) => {
  try {
    
    
     const payment = await PaymentCollection.findOne({ payment_ref_id: req.params.ref_id }).lean();
    if (!payment) return res.status(404).send("Payment not found");
   

    // Format date
    const date = new Date(payment.createdAt);
    payment.formattedDate = date.toLocaleDateString('en-GB'); // dd-mm-yyyy
    
    res.render("bus-incharge/view-payments", { payment});
  } catch (err) {
    console.error("Error fetching payment:", err);
    res.status(500).send("Internal Server Error");
  }
});
function generatePaymentRefId() {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PAY-${year}-${random}`;
}


router.get("/bus-incharge/view-all-payments",async (req,res)=>{
  try{
   
  const payments=await PaymentCollection.find().lean()
   payments.forEach(payment => {
      const date = new Date(payment.createdAt);
      payment.formattedDate = !isNaN(date) ? date.toLocaleDateString('en-GB') : 'N/A';
    });
   
  res.render("bus-incharge/view-all-payments", { payments });
  }
  catch{
    res.status(500).send("Internal Server Error");
  }
})


router.get("/bus-incharge/studentdetails",async (req,res)=>{
  try{
   
    //need to change to profile after student page updated
    const students=await loginCollection.find({role:"student"}).lean()
    res.render("bus-incharge/studentdetails",  {students});
    
  }
  catch{
    res.status(500).send("Internal Server Error");
  }
});


router.get("/bus-incharge/staffdetails",async (req,res)=>{
  try{
    
    //need to change to profile after student page updated
    const staff=await loginCollection.find({role:"teacher"}).lean()
    
    res.render("bus-incharge/staffdetails", { staff });
    
  }
  catch{
    res.status(500).send("Internal Server Error");
  }
});

router.get("/bus-incharge/schedule", async (req, res) => {
  try {
    const email = req.session?.user?.email;
    if (!email) return res.redirect("/loginform");

    const profile = await ProfileCollection.findOne({ email });
    const routeNumber = profile?.route_num;

    if (!routeNumber) return res.status(404).send("No route assigned");

    //connect directly from database stored collection
    
    const busData = await mongoose.connection.db
      .collection("routelists") // your route list collection name
      .findOne({ routeNumber:"profile.route_num"});
    
    res.render("bus-incharge/schedule", {
      pickupPoints: busData?.pickupSchedule || [],
    });
  } catch (err) {
    console.error("Error loading pickup points:", err);
    res.status(500).send("Internal Server Error");
  }
});

// 📌 1️⃣ Default route: When no :user is specified
router.get("/bus-incharge/chat", async (req, res) => {
  try {
    const currentUser = req.user;
     console.log(currentUser);
    // Get contacts or seed them
    let contacts = await ContactCollection.find({ owner: currentUser.email }).lean();

    if (contacts.length === 0) {
      const profiles = await ProfileCollection.find({ email: { $ne: currentUser.email } }).lean();

      const seededContacts = profiles.map(profile => ({
        owner: currentUser.email,
        name: profile.email,
        lastMessage: " ",
        lastMessageTime: new Date().toLocaleTimeString(),
        unreadCount: 0
      }));

      await ContactCollection.insertMany(seededContacts);
      contacts = seededContacts;
    }

    // Redirect to first contact's chat if available
    if (contacts.length > 0) {
      const firstContactEmail = encodeURIComponent(contacts[0].name);
      return res.redirect(`/bus-incharge/chat/${firstContactEmail}`);
    }

    // If no contacts found at all
    res.render("./bus-incharge/chat", {
      messages: [],
      contacts: [],
      selectedUser: null,
      selectedDisplayName: "",
      user: currentUser
    });

  } catch (err) {
    console.error("Error loading default chat page:", err);
    res.status(500).send("Something went wrong");
  }
});

router.get("/bus-incharge/chat/:user", async (req, res) => {
  try {
    const selectedUser = decodeURIComponent(req.params.user);
    const currentUser = req.user;
    console.log(currentUser);

    // 1️⃣ Get all users (excluding self)
    const profiles = await ProfileCollection.find({ email: { $ne: currentUser.email } }).lean();
   
    // 2️⃣ If ContactCollection is empty, seed it
    let contacts = await ContactCollection.find({owner: currentUser.email}).lean();
    if (contacts.length === 0) {
      const seededContacts = profiles.map(profile => ({
        owner: currentUser.email,
        name: profile.email,
        lastMessage: " ",
        lastMessageTime: new Date().toLocaleTimeString(),
        unreadCount: 0
      }));
      await ContactCollection.insertMany(seededContacts);
      contacts = seededContacts;
    }

    // 3️⃣ Build user info map from ProfileCollection
    const userEmails = contacts.map(c => c.name);
    const allProfiles = await ProfileCollection.find({ email: { $in: userEmails } }).lean();
    //profileImage covert into BASE64
    const profileMap = {};
          allProfiles.forEach(p => {
          let avatar = "/images/avatar.png";
            if (p.profileImage?.data) {
              const base64 = p.profileImage.data.toString("base64");
               const type = p.profileImage.contentType || "image/jpeg";
               avatar = `data:${type};base64,${base64}`;
            }

         profileMap[p.email] = {
          displayName: `${p.fName} ${p.lName}`,
          role: p.role,
          avatar
          };
      });

    // 4️⃣ Enrich contacts for frontend display
    const enrichedContacts = contacts.map(contact => {
      const profile = profileMap[contact.name] || {};
      return {
        ...contact,
        displayName: profile.displayName || contact.name,
        role:profile.role,
        avatar: profile.avatar || "/images/default.jpg",
        unread: contact.unreadCount > 0,
        active: contact.name === selectedUser
      };
    });

    // 5️⃣ Get chat messages between current user and selected user
    const messages = await MessageCollection.find({
      $or: [
        { sender: currentUser.email, receiver: selectedUser },
        { sender: selectedUser, receiver: currentUser.email }
      ]
    }).sort({ createdAt: 1 }).lean();

    // 6️⃣ Format for frontend chat view
    const formattedMessages = messages.map(msg => ({
      message: msg.text,
      senderName: profileMap[msg.sender]?.displayName || msg.sender,
      time: new Date(msg.createdAt).toLocaleTimeString(),
      isMe: msg.sender === currentUser.email
    }));

     const selectedProfile = profileMap[selectedUser] || {};
    // 7️⃣ Render chat view
    res.render("./bus-incharge/chat", {
      messages: formattedMessages,
      contacts: enrichedContacts,
     
      selectedUser,
      selectedDisplayName: selectedProfile.displayName || selectedUser,
      selectedAvatar: selectedProfile.avatar || "/images/default.jpg",
      user: currentUser
    });

  } catch (err) {
    console.error("Error loading chat page:", err);
    res.status(500).send("Something went wrong");
  }
});


router.get('/bus-incharge/notification', async (req, res) => {
  try {
    
    const role = req.session.user?.role;

    const notifications = await Notification.find({
     
       
        recipientRole: role 
    
    }).sort({ createdAt: -1 }).limit(5).lean();

    const notificationCount = notifications.length;
   console.log(notifications);
   
   console.log(notificationCount);

    res.render('bus-incharge/notification', {
      user: req.session.user,
      notifications,
      notificationCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.render('bus-incharge/notification', {
      user: req.session.user,
      notifications: [],
      notificationCount: 0
    });
  }
});

 

 

module.exports = router;
