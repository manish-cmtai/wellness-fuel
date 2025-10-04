import { Router } from 'express';
import {
  createNote,
  listNotes,
  getNoteById,
  updateNote,
  deleteNote,
  getNotesByCategory,
  getFavoriteNotes
} from '../controllers/notesController.js';

const router = Router();

// CRUD
router.post('/', createNote);
router.get('/', listNotes);
router.get('/:id', getNoteById);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

// Filters
router.get('/category/:category', getNotesByCategory);
router.get('/favorites/list', getFavoriteNotes);

export default router;
