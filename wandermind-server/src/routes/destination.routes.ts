import { Router } from 'express';
import {
  getDestinations, getDestinationBySlug, createDestination,
  updateDestination, deleteDestination, getFeaturedDestinations,
  toggleWishlist
} from '../controllers/destination.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getDestinations);
router.get('/featured', getFeaturedDestinations);
router.get('/:slug', getDestinationBySlug);
router.post('/', authenticate, requireRole('ADMIN'), createDestination);
router.put('/:id', authenticate, requireRole('ADMIN'), updateDestination);
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteDestination);
router.post('/:id/wishlist', authenticate, toggleWishlist);

export default router;
