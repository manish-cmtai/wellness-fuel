import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getProductById, getProductsByCategory, productGenerate, updateProduct, updateStock } from "../controllers/productsController.js";
import { upload } from "../config/s3Config.js";

const router= Router()

router.get("/productGenerate",upload.array('images', 4),productGenerate)

router.post('/', createProduct);        
router.get('/', getAllProducts);          


router.get('/category/:category', getProductsByCategory);


router.get('/:id', getProductById);       
router.put('/:id', updateProduct);       
router.delete('/:id', deleteProduct);      


router.patch('/:id/stock', updateStock); 


export default router