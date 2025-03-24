const User= require("../models/User")
const Profile= require("../models/Profile")
const OTP= require("../models/OTP")
const otpGenerator= require("otp-generator");
const bcrypt= require("bcrypt")
const jwt= require("jsonwebtoken")
require("dotenv").config()
exports.sendOtp=async(req,res)=>{
    try {
        const {email}= req.body;

        const checkUserPresent= await User.findOne({email});
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User Already Exists"
            })
        }

        var otp= otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })

        console.log("Otp Generated",otp);
        let result = await OTP.findOne({otp:otp})

        while(result){
            otp= otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            })
            result = await OTP.findOne({otp:otp})
        }

        const otpPayload={
            email,otp
        }
        const otpBody= await OTP.create(otpPayload);
        console.log(otpBody);

        res.status(200).json({
            success:true,
            message:"Otp sent successfully",
            otp,
        })

    } catch (error) {
        console.log("Error Sending OTP",error);
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.signUp=async(req,res)=>{
    try {
        const{
            firstName,
            lastName,
            email,
            accountType,
            contactNumber,
            password,
            confirmPassword,
            otp
        }=req.body;

        if(!firstName ||!lastName ||!email || !password ||!confirmPassword||!otp )
        {
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })
        }

        if(password!==confirmPassword)
        {
            return res.status(400).json({
                success:false,
                message:"Password and Confirm Password values are not matching, Please try again"
            })
        }

        const existingUser= User.findOne({email})
        if(existingUser)
        {
            return res.status(400).json({
                success:false,
                message:"User is already registered"
            })
        }

        const recentOtp= await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp)
        if(recentOtp.length==0)
        {
            return res.status(400).json({
                success:false,
                message:"Otp not found"
            })
        }

        if(otp!==recentOtp.otp)
        {
            return res.status(400).json({
                success:false,
                message:"Invalid Otp"
            })
        }

        const hashedPassword= await bcrypt.hash(password,10);
        
        
        const profileDetails=await Profile.create({
            gender:null,
            contactNumber:null,
            about:null,
            dateOfBirth:null,
        })
        const user={
            firstName,
            lastName,
            email,
            password:hashedPassword,
            accountType,
            contactNumber,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        }
        return res.status(200).json({
            success:true,
            message:"User registered successfully",
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"User is not registered, Please try again"
        })
    }
}

expports.login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password)
        {
            return res.status(403).json({
                success:false,
                message:"All fields are required, Please try again"
            })
        }

        const user= await User.findOne({email}).populate("additionalDetails");
        if(!user)
        {
            return res.status(401).json({
                success:false,
                message:"User is not registered, Please Signup first"
            })
        }

        if(await bcrypt.compare(password,user.password))
        {
            const payload={
                email:user.email,
                id:user._id,
                role:user.role
            }
            const token= jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            })
            user.token=token;
            user.password=undefined
            const options={
                expires:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                message:"User Logged in successfully",
                token,
                user
            })

        }else{
            return res.status(400).json({
                success:false,
                message:"Incorrect Password"
            })
        }
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"Login Failure, Please try again"
        })
    }
}

