import { Course } from "../models/course.model.js"
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from "../models/purchase.model.js";
import dotenv from "dotenv";
dotenv.config();


import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



export const createCourse=async(req,res)=>{
    const adminId=req.adminId
    const {title,description,price}=req.body
    try {
        if(!title||!description||!price){
            return res.status(400).json({error:"all the fields are required."})
        }
        const {image}=req.files
        if(!req.files|| Object.keys(req.files).length===0){
            return res.status(400).json({error:"no file uploaded"})
        }
        const allowedFormat=["image/jpeg","image/png"]
        if(!allowedFormat.includes(image.mimetype)){
            return res.status(400).json({error:"invalid file type.only jpg and png allowed"})
        }
        const cloud_response=await cloudinary.uploader.upload(image.tempFilePath)
        if(!cloud_response||cloud_response.error){
            return res.status(400).json({errors:"error in uploading file to server."})
        }

            const courseData={
            title,
            description,
            price,
            image:{
                public_id:cloud_response.public_id,
                url:cloud_response.url

            },
            creatorId:adminId
        }
      const course=await Course.create(courseData)
      res.json({
        message:"course created successfully",
        course
      })

    } catch (error) {
        console.log(error)
        res.status(500).json({errors:"error creating course"})
    }
}

export const updateCourse=async(req,res)=>{
    const adminId=req.adminId
    const {courseId}=req.params
    const {title, description, price, image}=req.body
    try {
        const course=await Course.findOneAndUpdate({
            _id:courseId,
            creatorId:adminId
        },{
            title,
            description,
            price,
            image:{
                public_id:image?.public_id,
                url:image?.url
            }
        })
        res.status(201).json({message:"course updated successfully",course})
    } catch (error) {
        res.status(500).json({errors:"error in course updating"})
        console.log("error in course update",error)
    }
}

export const deleteCourse=async(req,res)=>{
    const {courseId}=req.params
    const adminId=req.adminId
    try {
        const course=await Course.findOneAndDelete({
        _id:courseId,
        creatorId:adminId,
       }) 
       if(!course){
        return res.status(404).json({errors:"course not found"})
       }
       res.status(200).json({message:"course deleted successfully"})
    } catch (error) {
        res.status(500).json({errors:"error in deleting course"})
        console.log("error in course deleting")
    }
}

export const getCourses= async(req,res)=>{
    try {
        const courses=await Course.find({})
        res.status(201).json({courses})
    } catch (error) {
        res.status(500).json({errors:"error getting courses"})
        console.log("error to get the course",error)
    }
}

export const courseDetails=async(req,res)=>{
    const {courseId}=req.params
    try {
        const course=await Course.findById(courseId)
        if(!course){
            res.status(404).json({error:"course not found"})
        }
        res.status(200).json({course})
    } catch (error) {
        res.status(500).json({errors:"error in getting course details"})
        console.log("error in getting course details",error)
    }
}

export const buyCourses = async (req, res) => {
  const userId = req.userId;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const existingPurchase = await Purchase.findOne({ userId, courseId });

    if (existingPurchase) {
      return res.status(400).json({ error: "Already purchased" });
    }

    // ✅ CREATE PAYMENT INTENT (DO NOT CREATE PURCHASE HERE)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: course.price * 100, // amount in paise
      currency: "inr",
      metadata: {
        courseId,
        userId,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      course,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating payment intent" });
  }
};

export const confirmPurchase = async (req, res) => {
  const { courseId } = req.params;
  const { paymentIntentId } = req.body;
  const userId = req.userId;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ error: "Payment not verified" });
    }

    const existingPurchase = await Purchase.findOne({ userId, courseId });

    if (existingPurchase) {
      return res.status(400).json({ error: "Already purchased" });
    }

    await Purchase.create({
      userId,
      courseId,
    });

    res.json({ message: "Purchase saved successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error confirming purchase" });
  }
};
