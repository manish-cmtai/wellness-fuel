import { Router } from "express";
import { productGenerate } from "../controllers/productsController.js";
import multer from "multer";

const router= Router()


const upload = multer({ storage: multer.memoryStorage() });

router.get("/productGenerate",upload.array('images', 4),productGenerate)

router.post('/', createProduct);        
router.get('/', getAllProducts);          


router.get('/category/:category', getProductsByCategory);


router.get('/:id', getProductById);       
router.put('/:id', updateProduct);       
router.delete('/:id', deleteProduct);      


router.patch('/:id/stock', updateStock); 


export default router