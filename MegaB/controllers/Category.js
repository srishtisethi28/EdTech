const Category=require("../models/Category");

exports.createCategory=async(req,res)=>{
    try {
        const {name,description}=req.body;
        if(!name || !description)
        {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const categoryDetails= await Category.create({
            name:name,
            description:description
        })
        return res.status(200).json({
            success:true,
            message:"Tag created successfully",
            categoryDetails
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.showAllCategories= async(req,res)=>{
    try {
        const allCategories= await Category.find({},{name:true,description:true});
        return res.status(200).json({
            success:true,
            message:"All tags returned successfully",
            allCategories
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}