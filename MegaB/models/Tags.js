const mongoose= require("mongoose");

const tagsSchema= new mongoose.Schema({
    name:{
        type:String,
        requiredd:true,
    },
    description:{
        type:String,
        required:true,
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }
})

exports.module= mongoose.module("Tags",tagsSchema)