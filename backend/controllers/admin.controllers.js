import { Admin } from "../models/admin.model.js"
import bcrypt from "bcryptjs"
import * as z from "zod"
import jwt from "jsonwebtoken"



export const signup=async(req,res)=>{
    const {firstName, lastName, email, password}=req.body
    const adminSchema=z.object({
        firstName:z.string().min(2,{message:"firstname must be 2 char long"}),
        lastName:z.string().min(2,{message:"lastname must be 2 char long"}),
        email:z.string().email(),
        password:z.string().min(4,{message:"firstname must be 4 char long"})
    })
    const validatedData=adminSchema.safeParse(req.body)

    if(!validatedData.success){
        return res.status(400).json({errors:validatedData.error.issues.map(err=>err.message)})
    }
    
     const hashedpassword=await bcrypt.hash(password,10)
    try {
        const existingAdmin=await Admin.findOne({email:email})
        if(existingAdmin){
        return res.status(400).json({error:"admin already exists"})
        }
        const newAdmin=new Admin({firstName,lastName,email,password:hashedpassword})
        await newAdmin.save()
        res.status(200).json({message:"signup succeeded",newAdmin})
    } catch (error) {
        res.status(500).json({errors:"error in signup"})      
        console.log("error in signup",error)  
    }
}

export const login=async(req,res)=>{
    const {email,password}=req.body
    try {
        const admin=await Admin.findOne({email:email})
        
        const isPasswordCorrect=await bcrypt.compare(password,admin.password)
        if(!admin||!isPasswordCorrect){
            return res.status(403).json({errors:"invalid credentials"})
        }

        const token=jwt.sign({
            id: admin._id,
        },
        process.env.JWT_ADMIN_PASSWORD,
    
    {expiresIn:"1d"})
        const cookieOptions={
            expires:new Date(Date.now()+24*60*60*1000),
            httpOnly:true,
        }

        res.cookie("jwt",token,cookieOptions)
        res.status(201).json({message:"login successful",admin,token})


    } catch (error) {
        res.status(500).json({errors:"error in login"})
        console.log("error in login",error)
    }
}

export const logout=async(req,res)=>{
    try {
        if(!req.cookies.jwt){
            return res.status(401).json({error:"kindly login first"})
        }
        res.clearCookie("jwt")
        res.status(200).json({message:"logged out succesfulyy"})
    } catch (error) {
        res.status(500).json({error:"error in logout"})
        console.log("error in logout",error)
    }
}