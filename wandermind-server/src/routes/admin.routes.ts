import { Router } from 'express';
import { getAdminStats, getAllUsers, updateUserRole, getAllBookings, getAllDestinations } from '../controllers/admin.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// All admin routes require ADMIN role
router.use(authenticate, requireRole('ADMIN'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.get('/bookings', getAllBookings);
router.get('/destinations', getAllDestinations);

export default router;
