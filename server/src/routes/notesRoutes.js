import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  uploadNote,
  getNotes,
  getNoteById,
  downloadNote,
  deleteNote,
} from '../controllers/notesController.js';

const router = Router();

router.get('/', getNotes);
router.get('/:id/download', downloadNote);
router.get('/:id', getNoteById);
router.post('/', protect, upload.single('file'), uploadNote);
router.delete('/:id', protect, deleteNote);

export default router;
