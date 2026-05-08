import { Router } from 'express';
import {
  getDestinations,
  getFeaturedDestinations,
  getDestinationBySlug,
  createDestination,
  updateDestination,
  deleteDestination,
  toggleWishlist,
  getWishlist,
} from '../controllers/destination.controller';
import { authenticate, requireRole, authenticateOptional } from '../middleware/auth.middleware';

const router = Router();


router.get('/', authenticateOptional, getDestinations);
router.get('/featured', authenticateOptional, getFeaturedDestinations);

router.get('/my-wishlist', authenticate, getWishlist);

router.get('/:slug', authenticateOptional, getDestinationBySlug);

router.post('/:id/wishlist', authenticate, toggleWishlist);

// Admin routes 
router.post('/', authenticate, requireRole('ADMIN'), createDestination);
router.put('/:id', authenticate, requireRole('ADMIN'), updateDestination);
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteDestination);

export default router;