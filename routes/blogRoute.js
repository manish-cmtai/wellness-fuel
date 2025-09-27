import {Router} from "express"
import { blogGenerate, createBlog, deleteBlog, getAllBlogs, getBlogById, updateBlog } from "../controllers/blogController.js"

const router=Router()

router.post("/bloggenerate",blogGenerate)

router.post("/create",createBlog)

router.get("/",getAllBlogs)
router.get("/:id",getBlogById)


router.put("/:id",updateBlog)

router.delete("/:id",deleteBlog)

export default router