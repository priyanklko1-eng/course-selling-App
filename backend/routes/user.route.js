import express from "express"
const router=express.Router()
import { login, signup, logout,purchased } from "../controllers/user.controller.js";
import userMiddleware from "../middleware/user.mid.js";

router.post("/signup",signup)
router.post("/login",login)
router.get("/logout",logout)
router.get("/purchased",userMiddleware,purchased)





export default router;