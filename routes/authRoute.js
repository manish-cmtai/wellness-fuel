import { Router } from "express";
import { check, login, logout } from "../controllers/authController.js";
import { isLogin } from "../middleWares/isLogin.js";

const router=Router()

router.post("/login",login)
router.post("/check",isLogin ,check)
router.post("/logout",isLogin,logout)




export default router