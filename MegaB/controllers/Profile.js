const Profile= require("../models/Profile")
const User =require("../models/User")
const {uploadImageToCloudinary}= require("../utils/ImageUploader")

exports.updateProfile = async (req, res) => {
    try {
        const { gender, dateOfBirth = "", about = "", contactNumber } = req.body;
        const id = req.user.id;

        if (!gender || !contactNumber || !id) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const userDetails = await User.findById(id).populate("additionalDetails");

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const profileDetails = userDetails.additionalDetails;
        if (!profileDetails) {
            return res.status(404).json({
                success: false,
                message: "Profile details not found",
            });
        }

        profileDetails.gender = gender;
        profileDetails.about = about;
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.contactNumber = contactNumber;

        await profileDetails.save();

        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            profileDetails
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to update Profile, please try again",
        });
    }
};


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

exports.getAllEnolledCourses= async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}
exports.updateDisplayPicture = async (req, res) => {
    try {
        const userId = req.user.id;
        const imageFile = req.files?.displayPicture;

        if (!userId || !imageFile) {
            return res.status(400).json({ success: false, message: "User ID and image file are required" });
        }

        // Upload image to Cloudinary
        const result =await uploadImageToCloudinary(imageFile,process.env.FOLDER_NAME);

        // Update user with new image URL
        const updatedUser = await User.findByIdAndUpdate(userId, { image: result.secure_url }, { new: true });

        res.status(200).json({ success: true, message: "Display picture updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating display picture:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};