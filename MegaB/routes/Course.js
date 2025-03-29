const express= require("express")
const router= express.Router();

const { createCourse, getAllCourses, getCourseDetails} = require("../controllers/Course");
const {createCategory,showAllCategories,categoryPageDetails}= require("../controllers/Category")
const { createSection, updateSection, deleteSection } = require("../controllers/Section");
const { createSubSection, updateSubSection, deleteSubSection }= require("../controllers/SubSection")
const {createRating,getAveragerating,getAllRatings}= require("../controllers/RatingAndReview")
const {auth,isStudent,isAdmin,isInstructor}=require("../middlewares/Auth")

router.post("/createCourse",auth,isInstructor,createCourse)
router.post("/addSection",auth,isInstructor,createSection)
router.post("/updateSection",auth, isInstructor,updateSection)
router.post("/deleteSection",auth,isInstructor,deleteSection)
router.post("/addSubSection",auth,isInstructor,createSubSection)
router.post("/updateSubSection",auth, isInstructor,updateSubSection)
router.post("/deleteSubSection",auth,isInstructor,deleteSubSection)
router.get("/getAllcourses",getAllCourses)
router.post("/getCourseDetails",getCourseDetails)
router.post("/createrating",auth,isStudent,createRating)
router.get("/getAverageRating",getAveragerating)
router.get("/getReviews",getAllRatings)
router.post("/createCategory",auth,isAdmin,createCategory)
router.get("/showAllCategories",showAllCategories)
router.get("/getCategoryPageDetails",categoryPageDetails)


module.exports=router