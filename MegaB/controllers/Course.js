const User= require("../models/User")
const Category=require("../models/Category")
const Course=require("../models/Course")
const {uploadImageToCloudinary}= require("../utils/ImageUploader")


exports.createCourse = async (req, res) => {
    try {
        const { courseName, description, price, whatYouWillLearn, tag, category } = req.body;
        const thumbnail = req.files?.thumbnailImage;

        // Validate required fields
        if (!courseName || !description || !whatYouWillLearn || !price || !tag || !thumbnail || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if instructor exists
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Not Found"
            });
        }

        // Fix: Correctly fetch category from the Category model
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category Not Found"
            });
        }

        // Fix: Await the cloudinary upload
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // Create a new course
        const newCourse = await Course.create({
            courseName,
            description,
            price,
            whatYouWillLearn,
            tag,
            category: categoryDetails._id,
            instructor: instructorDetails._id,
            thumbnail: thumbnailImage.secure_url
        });

        // Fix: Use correct `_id` field in update query
        await User.findByIdAndUpdate(
            instructorDetails._id,
            { $push: { courses: newCourse._id } },
            { new: true }
        );

        await Category.findByIdAndUpdate(
            categoryDetails._id,
            { $push: { courses: newCourse._id } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Course Created Successfully",
            newCourse
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed Creating Course"
        });
    }
};
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

exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body||req.params; 

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required",
            });
        }

        const courseDetails = await Course.findById(courseId)
            .populate("category")
            .populate({
                path: "instructor",
                populate: { path: "additionalDetails" },
            })
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection", // Now, this is an array
                    model: "SubSection", // Explicitly mention the model
                },
            })
            .exec();

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: `Course details not found with ID: ${courseId}`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: courseDetails,
        });

    } catch (error) {
        console.error("Error fetching course details:", error);
        return res.status(500).json({
            success: false,
            message: "Course details not fetched",
            error: error.message,
        });
    }
};