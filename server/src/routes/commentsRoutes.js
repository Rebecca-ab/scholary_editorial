import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { addComment, getComments, deleteComment } from '../controllers/commentsController.js';

const router = Router();

router.get('/notes/:noteId/comments', getComments);
router.post('/notes/:noteId/comments', protect, addComment);
router.delete('/notes/:noteId/comments/:id', protect, deleteComment);

export default router;
