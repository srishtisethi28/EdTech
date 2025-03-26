const Section= require("../models/Section")
const SubSection= require("../models/SubSection")
const {uploadImageTocloudinary}=require("../utils/ImageUploader")
exports.createSubSection=async(req,res)=>{
    try {
        const {title,description,timeDuration,sectionId}=req.body;
        const video= req.files.videoFile;
        if(!title ||!timeDuration || !description ||!sectionId ||!video)
        {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const uploadDetails=await uploadImageTocloudinary(video,process.env.FOLDER_NAME);
        const subSectionDetails= await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            video:uploadDetails.secure_url,
        })
        const updatedSectionDetails= await Section.findByIdAndUpdate({_id:sectionId}
            ,{
                $push:{
                    subSection:subSectionDetails._id
                }
            },
            {new:true}
        )
        return res.status(200).json({
            success:true,
            message:"SubSection created successfully",
            updatedSectionDetails
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Unable to create SubSection, please try again",
            error:error.message
        })
    }
}

exports.updateSubSection=async(req,res)=>{
    try {
        const {title,description,timeDuration,subSectionId}=req.body;
        const video=req.files.videoFile;
        if(!title || !description || !timeDuration || !subSectionId ||!video)
        {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const uploadDetails=await uploadImageTocloudinary(video,process.env.FOLDER_NAME);
        await SubSection.findByIdAndUpdate({_id:subSectionId},
            {
                title,
                description,
                timeDuration,
                video:uploadDetails.secure_url
            },
            {new:true},
        )
        return res.status(200).json({
            success:true,
            message:"SubSection updated successfully",
            updatedSectionDetails
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Unable to update SubSection, please try again",
            error:error.message
        })
    }
}

exports.ddeleteSubSection=async(req,res)=>{
    try {
        const {subSectionId}=req.body;
        if( !subSectionId )
        {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        await SubSection.findByIdAndDelete({_id:subSectionId})
        return res.status(200).json({
            success:true,
            message:"SubSection deleted successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Unable to delete SubSection, please try again",
            error:error.message
        })
    }
}