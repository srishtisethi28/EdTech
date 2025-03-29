const RatingsAndReviews= require("../models/RatingsAndreviews")
const Course= require("../models/Course");
const { default: mongoose } = require("mongoose");

exports.createRating=async (req,res)=>{
    try {
        const userId= req.user.id;
        const {rating,review,courseId}=req.body;
        const courseDetails= await Course.find({
            _id:courseId,
            studentsEnrolled:{$elemMatch:{$eq:userId}}
        });
        if(!courseDetails)
        {
            return res.status(404).json({
                success:false,
                message:error.message
            })
        }

        const alreadyReviewed= await RatingsAndReviews.find(
            {user:userId,
            course:courseId}
        )

        if(alreadyReviewed)
        {
            return res.status(403).json({
                success:false,
                message:"Course already reviewd by user"
            })
        }

        const updatedReview= await RatingsAndReviews.create({
            user:userId,
            course:courseId,
            rating,
            review
        }) 

        const updatedCourse=await Course.find(
            {_id:courseId},
            {
                $push:{ratingsAndreviews:updatedReview._id}
            },
            {new:true}
        )
        console.log(updatedCourse)

        return res.status(200).json({
            success:true,
            message:"Rating and review created successfully",
            updatedReview
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error creating rating and review"
        })
    }
}

exports.getAveragerating=async(req,res)=>{
    try {
        const courseId=req.body.courseId;

        const result= await RatingsAndReviews.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId)
                },
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"}
                },

            }
        ])
        if(result.length>0)
        {
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating
            })
        }
        return res.status(200).json({
            success:true,
            averageRating:0,
            message:"No ratings yet"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error getting avg rating and review"
        })
    }
}


exports.getAllRatings=async(req,res)=>{
    try {
        const allReviews=await RatingsAndReviews.find({})
                                .sort({rating:"desc"})
                                .populate({
                                    path:"user",
                                    select:"firstName lastName email image"
                                })
                                .populate({
                                    path:"course",
                                    select:"courseName"
                                })
                                .exec();
        return res.status(200).json({
            success:true,
            message:"Reviews fetched successfully",
            allReviews
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error getting avg rating and review"
        })
    }
}