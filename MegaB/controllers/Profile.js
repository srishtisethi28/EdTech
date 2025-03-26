const Profile= require("../models/Profile")
const User =require("../models/User")

exports.updateProfile= async(req,res)=>{
    try {
        const {gender,dateOfBirth="",about="",contactNumber}=req.body
        const id= req.user.id
        if(!gender ||!contactNumber ||!id)
        {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const userDetails= await User.findById(id);
        const profileId= userDetails.additionalDetails;
        const profileDetails=await User.findById(profileId)
        profileDetails.gender=gender;
        profileDetails.about=about;
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.contactNumber=contactNumber;

        await profileDetails.save();
        return res.status(200).json({
            success:true,
            message:"Profile Updated Successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to update Profile, please try again"
        })
    }
}

exports.deleteAccount= async(req,res)=>{
    try {
        const id=req.user.id;
        const userDetails= await findById(id);
        if(!userDetails)
        {
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            })
        }
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        await User.findByIdAndDelete({_id:id})
        return res.status(200).json({
            success:true,
            message:"User Deleted Successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to delete user, please try again"
        })
    }
}

exports.getAllUserDetails=async(req,res)=>{
    try {
        const id= req.user.id;
        const userDetails= await User.findById(id).populate("additionalDetails").exec();
        return res.status(200).json({
            success:true,
            message:"User details fetched successfully",
            userDetails
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to fetch user details, please try again"
        })
    }
}