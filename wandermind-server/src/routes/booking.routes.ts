import { Router } from 'express';
import { createBooking, getMyBookings, getBookingById, updateBookingStatus, exportBookingsReport } from '../controllers/booking.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createBooking);
router.get('/my', authenticate, getMyBookings);
router.get('/:id', authenticate, getBookingById);
router.patch('/:id/status', authenticate, requireRole('HOST', 'ADMIN'), updateBookingStatus);
router.get('/export', authenticate, requireRole('ADMIN'), exportBookingsReport);


export default router;
