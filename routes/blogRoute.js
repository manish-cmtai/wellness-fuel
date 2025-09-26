import {Router} from "express"
import { blogGenerate, createBlog } from "../controllers/blogController.js"

const router=Router()

router.get("/bloggenerate",blogGenerate)
router.post("/create",createBlog)
router.get("/",createBlog)

export default router