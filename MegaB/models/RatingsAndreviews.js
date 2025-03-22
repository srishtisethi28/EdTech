const mongoose= require("mongoose")

const ratingsAndreviewsSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    rating:{
        type:Number,
        required:true,
    },
    review:{
        type:String,
        required:true,
    }
})

exports.module=mongoose.model("RatingsAndReviews",ratingsAndreviewsSchema)