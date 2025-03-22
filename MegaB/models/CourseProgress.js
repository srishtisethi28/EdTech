const mongoose= require("mongoose");

const courseProgressSchema= new mongoose.Schema({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    completedVedios:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection",
        }
    ]
})

exports.module=mongoose.model("CourseProgress",courseProgressSchema);