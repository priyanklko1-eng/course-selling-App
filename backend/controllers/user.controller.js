import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import * as z from "zod"
import jwt from "jsonwebtoken"
import { Purchase } from "../models/purchase.model.js"
import { Course } from "../models/course.model.js"

export const signup=async(req,res)=>{
    const {firstName, lastName, email, password}=req.body
    const userSchema=z.object({
        firstName:z.string().min(2,{message:"firstname must be 2 char long"}),
        lastName:z.string().min(2,{message:"lastname must be 2 char long"}),
        email:z.string().email(),
        password:z.string().min(4,{message:"firstname must be 4 char long"})
    })
    const validatedData=userSchema.safeParse(req.body)

    if(!validatedData.success){
        return res.status(400).json({errors:validatedData.error.issues.map(err=>err.message)})
    }
    
     const hashedpassword=await bcrypt.hash(password,10)
    try {
        const existingUser=await User.findOne({email:email})
        if(existingUser){
        return res.status(400).json({error:"user already exists"})
        }
        const newUser=new User({firstName,lastName,email,password:hashedpassword})
        await newUser.save()
        res.status(200).json({message:"signup succeeded",newUser})
    } catch (error) {
        res.status(500).json({errors:"error in signup"})      
        console.log("error in signup",error)  
    }
}

export const login=async(req,res)=>{
    const {email,password}=req.body
    try {
        const user=await User.findOne({email:email})
        
        const isPasswordCorrect=await bcrypt.compare(password,user.password)
        if(!user||!isPasswordCorrect){
            return res.status(403).json({errors:"invalid credentials"})
        }

        const token=jwt.sign({
            id: user._id,
        },
        process.env.JWT_USER_PASSWORD,
    
    {expiresIn:"1d"})
        const cookieOptions={
            expires:new Date(Date.now()+24*60*60*1000),
            httpOnly:true,
        }

        res.cookie("jwt",token,cookieOptions)
        res.status(201).json({message:"login successful",user,token})


    } catch (error) {
        res.status(500).json({errors:"error in login"})
        console.log("error in login",error)
    }
}

export const logout=async(req,res)=>{
    try {
        res.clearCookie("jwt")
        res.status(200).json({message:"logged out succesfulyy"})
    } catch (error) {
        res.status(500).json({error:"error in logout"})
        console.log("error in logout",error)
    }
}

export const purchased=async(req,res)=>{
    const userId=req.userId
    try {
        const purchased=await Purchase.find({userId})
        let purchasedCourseId=[]
        for(let i=0;i<purchased.length;i++){
            purchasedCourseId.push(purchased[i].courseId)
        }

        const courseData=await Course.find(
                {
                    _id:{$in:purchasedCourseId},
                }
            )
        res.status(200).json({purchased,courseData})
    } catch (error) {
        res.status(500).json({error:"error in course purchased data"})
        console.log("error in course purchased data..",error)
    }
}