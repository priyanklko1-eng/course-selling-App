import dotenv from "dotenv"
dotenv.config()
import express from "express"
import  CourseRoute  from "./routes/course.route.js"
import  UserRoute  from "./routes/user.route.js"
import adminRoute from "./routes/admin.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"

import mongoose from "mongoose"
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from "express-fileupload";




const app = express()
const port = process.env.PORT || 3000


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT || 5000, () => {
      console.log("Server started");
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });


app.use(express.json())
app.use(cookieParser())

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
 // Configuration
    cloudinary.config({ 
        cloud_name: process.env.cloud_name, 
        api_key: process.env.api_key, 
        api_secret: process.env.api_secret // Click 'View API Keys' above to copy your API secret
    });

app.get('/', (req, res) => {
  res.send('priyank sharma and sharma')
})
app.use(
  cors()
);



app.use("/api/v1/course",CourseRoute)
app.use("/api/v1/user",UserRoute)
app.use("/api/v1/admin",adminRoute)


app.post("/course/buy/:courseId", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 50000, // ₹500 in paise (IMPORTANT: Stripe uses smallest currency unit)
      currency: "inr",
      payment_method_types: ["card"],
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

