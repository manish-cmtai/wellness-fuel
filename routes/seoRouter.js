import { Router } from 'express';
import {
  createSEO,
  getAllSEO,
  getSEOById,
  updateSEO,
  deleteSEO
} from '../controllers/settingController.js';

const router = Router();

router.post('/', createSEO);
router.get('/', getAllSEO);
router.get('/:id', getSEOById);
router.put('/:id', updateSEO);
router.delete('/:id', deleteSEO);

export default router;
