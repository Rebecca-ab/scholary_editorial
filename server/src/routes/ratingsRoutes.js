import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { rateNote, getNoteRatings } from '../controllers/ratingsController.js';

const router = Router();

router.get('/notes/:noteId/ratings', getNoteRatings);
router.post('/notes/:noteId/ratings', protect, rateNote);

export default router;
