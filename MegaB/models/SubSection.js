const mongoose= require("mongoose")

const subSectionSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    timeDuration:{
        type:String,
        required:true,
    },
    videoUrl:{
        type:String,
        required:true,
    }
})

exports.module= mongoose.model("SubSection",subSectionSchema)