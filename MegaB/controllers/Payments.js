const {instance}= require("../config/razorpay")
const User= require("../models/User")
const Course= require("../models/Course")
const {courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail")
const mailSender= require("../utils/mailSender")
const mongoose= require("mongoose")

exports.capturePayment=async(req,res)=>{
    
        const userId=req.user.id;
        const {course_id}=req.body
        if(!course_id)
        {
            return res.status(500).json({
                success:false,
                message:"Please provide valid course id"
            })
        }
        let course;
        try {
            course= await Course.findById(course_id);
            if(!course)
            {
                return res.status(404).json({
                    success:false,
                    message:"Course Not Found"
                })
            }
            const uid= new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid))
            {
                return  res.status(200).json({
                    success:false,
                    message:"User Already Enrolled"
                })
            }


        } catch (error) {
            return res.status(500).json({
                success:false,
                message:error.message
            })
        }

        const amount=course.price;
        const currency="INR";

        const options={
            amount:amount*100,
            currency:currency,
            reciept:Math.random(Date.now()).toString(),
            notes:{
                courseId:course_id,
                userId
            }
        }

        try {
            const paymentResponse= await instance.orders.create(options);
            console.log(paymentResponse);
            return res.status(200).json({
                success:true,
                courseName:course.courseName,
                courseDescription:course.courseDescription,
                thumbnail:course.thumbnail,
                amount:paymentResponse.amount,
                currency:paymentResponse.currency,
                orderId:paymentResponse.id
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message
            })
        }
    
}

exports.verifySignature=async(req,res)=>{
    const webhooksecret="12345678";

    const signature= req.headers['x-razorpay-signature'];

    const shasum=crypto.createHmac("sha256",webhooksecret);
    shasum.update(JSON.stringify(req.body));
    const digest=shasum.digest("hex");

    if(signature==digest)
    {
        console.log("payment is authorised")

        const {courseId, userId}=req.body.payload.payment.entity.notes;

        try {
            const enrolledCourse=await Course.findOneAndUpdate(
                {_id:courseId},
                {$push:{
                    studentsEnrolled:userId
                }},
                {new:true}
            )
            if(!enrolledCourse)
            {
                return res.status(404).json({
                    success:false,
                    message:"Course not found"
                })
            }
            console.log(enrolledCourse);

            const enrolledStudent= await User.findOneAndUpdate(
                {_id:userId},
                {$push:{
                    courses:courseId
                }},
                {new:true}
            )
            console.log(enrolledStudent)

            const emailResponse= await mailSender(
                enrolledStudent.email,
                "Congratulations",
                "congratulations u r onboarded to a new codehelp course"
            )
            console.log(emailResponse)

            return res.status(200).json({
                success:true,
                message:"signature verified and course added"
            })
        } catch (error) {
            return res.status(500).json({
                success:false,
                message:error.message
            })
        }
    }else{
        return res.status(500).json({
            success:false,
            message:"Invalid request",
        })
    }
}