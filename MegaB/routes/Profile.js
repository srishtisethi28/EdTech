const express= require("express")
const router= express.Router();

const {auth}= require("../middlewares/auth")
const {updateProfile,deleteAccount,getAllUserDetails,updateDisplayPicture}= require("../controllers/Profile")

router.put("/updateProfile",auth,updateProfile)
router.delete("/deleteProfile",deleteAccount)
router.get("/getUserDetails",auth,getAllUserDetails)
//router.get("/getEnrolledCourses",auth,getEnrolledcourses)
// router.put("/updateDisplayPicture",auth,updateDisplayPicture)
module.exports=router