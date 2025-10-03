import {Router} from "express";
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "../controllers/categoryController.js";
import { upload } from "../config/s3Config.js";


const router = Router();

router.post("/", upload.single('imageUrl'), createCategory);     
router.get("/", getCategories);        
router.get("/:id", getCategoryById);  
router.put("/:id", updateCategory);   
router.delete("/:id", deleteCategory); 

export default router;
