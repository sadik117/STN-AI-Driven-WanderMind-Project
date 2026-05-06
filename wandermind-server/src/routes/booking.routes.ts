import { Router } from 'express';
import { createBooking, getMyBookings, getBookingById, updateBookingStatus, cancelBooking } from '../controllers/booking.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createBooking);
router.get('/my', authenticate, getMyBookings);
router.get('/:id', authenticate, getBookingById);
router.patch('/:id/status', authenticate, requireRole('HOST', 'ADMIN'), updateBookingStatus);
router.patch('/:id/cancel', authenticate, cancelBooking);

export default router;
