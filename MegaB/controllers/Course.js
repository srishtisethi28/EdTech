const User= require("../models/User")
const Category=require("../models/Category")
const Course=require("../models/Course")
const {uploadImageTocloudinary}= require("../utils/ImageUploader")

exports.createCourse=async(req,res)=>{
    try {
        const {courseName,description,price,whatYouWillLearn,tag}=req.body
        const thumbnail=req.files.thumbnailImage

        if(!courseName || !description || !whatYouWillLearn||!price ||!tag ||!thumbnail)
        {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        const userId=req.user.id;
        const instructorDetails=await User.findById(userId)
        if(!instructorDetails)
        {
            return res.status(404).json({
                success:false,
                message:"Instructor Not Found"
            })
        }
        const tagDetails=await User.findById(tag)
        if(!tagDetails)
        {
            return res.status(404).json({
                success:false,
                message:"Tag Not Found"
            })
        }

        const thumbnailImage= uploadImageTocloudinary(thumbnail,process.env.FOLDER_NAME);
        const newCourse= await Course.create({
            courseName,
            description,
            price,
            whatYouWillLearn,
            tag:tagDetails._id,
            instructor:instructorDetails._id,
            thumbnail:thumbnailImage.secure_url
        })

        await User.findByIdAndUpdate(
            {id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id,
                }
            },
            {
                new:true
            }
        )

        await Category.findByIdAndUpdate(
            {id:tagDetails._id},
            {
                $push:{
                    courses:newCourse._id,
                }
            },
            {new:true}
        )

        res.status(200).json({
            success:true,
            message:"Course Created Successfully"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Failed Creating Course"
        })
    }
}

exports.getAllCourses=async(req,res)=>{
    try {
        const allCourses= await Course.find({})
        return res.status(200).json({
            success:true,
            message:"Data for All courses fetched successfully",
            allCourses
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error fetching All Courses",
            error:error.message
        })
    }
}

exports.getCourseDetails=async(req,res)=>{
    try {
        const {courseId}=req.body;
        const courseDetails=await Course.find({_id:courseId})
                                            .populate("category")
                                            .populate({
                                                path:"instructor"
                                                .populate("additionalDetails")
                                            })
                                            .populate("ratingsAndreviews")
                                            .populate({
                                                path:"courseContent"
                                                .populate("subSection")
                                            })
                                            .exec();
        if(!courseDetails)
        {
            return res.status(500).json({
                success:false,
                message:`Course details not found with ${courseId}`
            })
        }
        return res.status(200).json({
            success:true,
            message:"Course details fetched successfully",
            data:courseDetails
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Course details not fetched"
        })
    }
}