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
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true,
        index:true
    }
})

module.exports=mongoose.model("RatingsAndReviews",ratingsAndreviewsSchema)