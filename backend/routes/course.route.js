import express from "express"
const router=express.Router()
import { createCourse, updateCourse,deleteCourse, getCourses,courseDetails, buyCourses } from "../controllers/course.controllers.js";
import userMiddleware from "../middleware/user.mid.js";
import adminMiddleware from "../middleware/admin.mid.js";
import { confirmPurchase } from "../controllers/course.controllers.js";

router.post("/create",adminMiddleware,createCourse)
router.put("/update/:courseId",adminMiddleware,updateCourse)
router.delete("/delete/:courseId",adminMiddleware,deleteCourse)
router.get("/courses",getCourses)
router.get("/:courseId",courseDetails)

router.post("/buy/:courseId",userMiddleware,buyCourses)
router.post("/confirm/:courseId", userMiddleware, confirmPurchase);



export default router;