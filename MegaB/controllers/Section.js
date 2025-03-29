const Course= require("../models/Course")
const Section =require("../models/Section");

exports.createSection=async(req,res)=>{
    try {
        const {sectionName,courseId}=req.body;
        if(!sectionName || !courseId)
        {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const section= await Section.create({sectionName});
        const updatedCourseDetails=await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:section._id
                }
            }
        )
        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            updatedCourseDetails
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to create section, please try again",
            error:error.message
        })
    }
}

exports.updateSection=async(req,res)=>{
    try {
        const {sectionName,sectionId}=req.body;
        if(!sectionId || !sectionName)
        {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const updatedSection= await Section.findByIdAndUpdate(sectionId,
            {sectionName},
            {new:true}
        )
        return res.status(200).json({
            success:true,
            message:"Section updated successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to update section, please try again",
            error:error.message
        })
    }
}

exports.deleteSection= async(req,res)=>{
    try {
        const {sectionId}=req.body;
        await Section.findByIdAndDelete(sectionId);
        return res.status(200).json({
            success:true,
            message:"Section deleted successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to delete section, please try again"
        })
    }
}