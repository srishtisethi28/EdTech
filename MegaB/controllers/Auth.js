const User= require("../models/User")
const OTP= require("../models/OTP")
const otpGenerator= require("otp-generator");
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