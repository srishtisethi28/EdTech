const mongoose= require("mongoose");

const profileSchema= new mongoose.Schema({
    gender:{
        type:String,
    },
    dateOfBirth:{
        type:String,
    },
    about:{
        type:String,
        trim:true,
    },
    contactNo:{
        type:Number,
        trim:true,
    }
})

exports.module= mongoose.model("Profile",profileSchema);