const mongoose= require("mongoose");
const mailSender = require("../utils/mailSender");

const otpSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    },
    otp:{
        type:String,
        required:true,
    }
})

async function sendVerificationEmail (email,otp){
    try {
        const mailResponse= await mailSender(email, "Verification email from StudyNotion",otp);
        console.log("Email sent successfully",mailResponse);
    } catch (error) {
        console.log("Error sending Verification email",error);
    }
}

otpSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})

exports.module= mongoose.model("OTP",otpSchema)