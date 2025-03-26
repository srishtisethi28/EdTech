const mongoose= require("mongoose")
const courseSchema= new mongoose.Schema({
    courseName:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    whatYouWillLearn:{
        type:String,
        required:true,
    },
    instructor:{
        type:String,
        required:true,
    },
    courseContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
    }],
    ratingsAndreviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingsAndReviews"
        }
    ],
    price:{
        type:Number,
        required:true,
    },
    thumbnail:{
        type:String,
        required:true
    },
    tag:{
        type:String
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    studentsEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]

})

exports.module= mongoose.model("Course",courseSchema)