import { Router } from "express";
import { productGenerate } from "../controllers/productsController.js";
import multer from "multer";

const route= Router()


const upload = multer({ storage: multer.memoryStorage() });

route.get("/productGenerate",upload.array('images', 4),productGenerate)


export default route