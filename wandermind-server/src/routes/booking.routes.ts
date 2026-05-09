import { Router } from 'express';
import { createBooking, getMyBookings, getBookingById, updateBookingStatus, exportBookingsReport, getHostBookings } from '../controllers/booking.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createBooking);
router.get('/my', authenticate, getMyBookings);
router.get('/host-bookings', authenticate, requireRole('HOST'), getHostBookings);
router.get('/:id', authenticate, getBookingById);
router.patch('/:id/status', authenticate, requireRole('HOST', 'ADMIN'), updateBookingStatus);
router.get('/export', authenticate, requireRole('ADMIN'), exportBookingsReport);


export default router;
