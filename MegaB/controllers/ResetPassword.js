const User=require("../models/User")
const mailSender= require("../utils/mailSender")
const bcrypt=require("bcrypt")

exports.resetPasswordToken=async(req,res)=>{
    try {
        const email=req.body.email;
        const user=await User.findOne({email:email})
        if(!user)
        {
            return res.status(401).json({
                success:false,
                message:"Your Email is not registered with us."
            })
        }

        const token= crypto.randomUUID();
        const updatedDetails=await User.findOneAndUpdate({emil:email},
            {
                token:token,
                resetPasswordExpires:5*60*1000
            },
            {new:true}
        )
        const url= `http://localhost:3000/update-password/${token}`

        await mailSender(email,"Password Reset Link",`Password Reset Link: ${url}`)
        return res.status(200).json({
            success:true,
            message:"Password Reset mail sent successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Could not Send reset password mail"
        })
    }
}

exports.resetPassword=async(req,res)=>{
    try {
        const {password,confirmPassword,token}=req.body;

        if(password!==confirmPassword)
        {
            return res.status(400).json({
                success:false,
                message:"Password not matching"
            })
        }
        const userDetails= await User.findOne({token:token})
        if(!userDetails)
        {
            return res.status(400).json({
                success:false,
                message:"Token is not valid"
            })
        }
        if(userDetails.resetPasswordExpires<Date.now())
        {
            return res.status(400).json({
                success:false,
                message:"Token expired, Please try generating again"
            })
        }

        const hashedPassword=await bcrypt.hash(password,10);
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true}
        )

        return res.status(200).json({
            success:true,
            message:"Password updated successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Password not reseted, Please try again"
        })
    }
}