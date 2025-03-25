const jwt=require("jsonwebtoken")
const User =require("../models/User")
require("dotenv").config();

//auth
exports.auth=async(req,res,next)=>{
    try {
        const token= req.cookies.token || req.body.token ||req.header("Authorisation").replace("Bearer","")
        if(!token)
        {
            return res.status(401).josn({
                success:false,
                message:"Token Missing"
            })
        }
        try {
            const decode= jwt.verify(token,process.env.JWT_SECRET)
            console.log(decode);
            req.user=decode
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"Token is not valid"
            })
        }
        next();
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"Something went wrong while validating token "
        })
    }
}

exports.isStudent=async(req,res,next)=>{
    try {
        if(req.user.accountType!=="Student")
        {
            return res.status(401).josn({
                success:false,
                message:"This is a protected route for students"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, Please try again"
        })
    }
}
exports.isAdmin=async(req,res,next)=>{
    try {
        if(req.user.accountType!=="Admin")
        {
            return res.status(401).josn({
                success:false,
                message:"This is a protected route for Admin"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, Please try again"
        })
    }
}
exports.isInstructor=async(req,res,next)=>{
    try {
        if(req.user.accountType!=="Instructor")
        {
            return res.status(401).josn({
                success:false,
                message:"This is a protected route for Instructor"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, Please try again"
        })
    }
}
