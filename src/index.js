require('dotenv').config();
const  express =require("express")
const app =express()
const path= require("path")
const hbs=require("hbs")
const templatepath=path.join(__dirname,'../template')
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");
const cors = require('cors');



app.use(express.static(path.join(__dirname, '../static')));
//app.use(express.static(path.join(__dirname, '../public/admindash')));
app.use(express.static('public'));
app.use(express.static('static'));
app.use(cors());

const {LogInCollection,PaymentCollection}=require("./mongodb")

app.use(express.json())
app.set("view engine","hbs")
app.set("views",templatepath)
app.use(express.urlencoded({extended:false}))

//const port = process.env.PORT || 4000;
const razorpay = new Razorpay({
    key_id: "rzp_test_XLEobc5mihNeOK",
    key_secret: "nUMwcrj3cYvjfT4XSB0IHhTl",
});

app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/signup",(req,res)=>{
    res.render("signup");
})
app.get("/admindash",(req,res)=>{
    res.render("admindash");
})
app.get("/contact",(req,res)=>{
    res.render("contact");
})
app.get("/about",(req,res)=>{
    res.render("about");
})
app.get("/businchargedash",(req,res)=>{
    res.render("businchargedash");
})

app.get("/routelist",(req,res)=>{
    res.render("routelist");
})
app.get('/payment', (req, res) => {
    res.render('payment', {
        razorpay_key:"rzp_test_XLEobc5mihNeOK" // Pass Razorpay Key from environment variable
    });
});


app.post("/login",async(req,res)=>{

   

   try{
   const check=await LogInCollection.findOne({name:req.body.name})
    if(check.password===req.body.password){
     res.render("home")
   }
    else{
        
            res.send(`
                <script>
                    alert("Wrong password");
                    window.history.back(); // Redirects back to the previous page
                </script>
            `);
        }
   
   
   }catch{
    res.send("wrong details")

   }
  

})

app.post('/signup', async (req, res) => {
    try {
        // Ensure the request body is properly structured
        const { userType,name, password} = req.body;
        const data = {
            userType: req.body.userType,  
            name: req.body.name,
            password: req.body.password
            // Include userType in the data
        };
        

        // Check if user already exists based on name
        const checking = await LogInCollection.findOne({ name: req.body.name });

        if (checking) {
            return res.send("User details already exist.");
        } else {
            // Insert the new user into the collection
            // Alternatively, if you have a new instance of a Mongoose model:
                const user = new LogInCollection(data);
                await user.save(); 
                res.redirect('/');  // Correct way for Mongoose

        }
    } catch (error) {
        console.error("Error during user registration:", error.message);
        res.status(500).send("An error occurred while processing the request.");
    }
});


    
// Razorpay instance


// Handle the payment creation
app.post('/create-order', async (req, res) => {
    try {
        const {route,email,amount} = req.body;
       

       

        

        // Create order with Razorpay
        const options = {
            amount: amount*100,  // Amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
             // Auto-capture payment
        };

        const order = await razorpay.orders.create(options);

        // Send the order details to the client-side
        const newPayment = new PaymentCollection({
            email,
            route,
            amount,
            orderId: order.id, // Razorpay order ID
            status: "Pending",
          });
      
          await newPayment.save();
      
          res.json({ success: true, order });
        } catch (error) {
          console.error('Error creating order:', error);
          res.status(500).json({ success: false, message: 'Failed to create order', error });
        }
      });

// Verify payment after user completes the payment
app.post('/verify-payment', async (req, res) => {
    try{
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const hmac = crypto.createHmac('sha256', 'nUMwcrj3cYvjfT4XSB0IHhTl'); // Replace with your Key Secret
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
    
    // Update payment status in the database
    const payment = await collection.PaymentCollection.findOneAndUpdate(
      {orderId: razorpay_order_id },
      
      { $set: { paymentId: razorpay_payment_id, status: 'successful' } },
      
      { new: true }
    );
    console.log(payment);

    res.json({ success: true, message: 'Payment verified successfully', payment });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error });
  }
});   


app.listen(3000,()=>{
    console.log("port connected")
})
