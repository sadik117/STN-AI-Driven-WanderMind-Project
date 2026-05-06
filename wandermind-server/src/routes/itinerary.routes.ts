import { Router } from 'express';
import { getMyItineraries, getItineraryById, saveItinerary, deleteItinerary } from '../controllers/itinerary.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/my', authenticate, getMyItineraries);
router.get('/:id', authenticate, getItineraryById);
router.post('/', authenticate, saveItinerary);
router.delete('/:id', authenticate, deleteItinerary);

export default router;
