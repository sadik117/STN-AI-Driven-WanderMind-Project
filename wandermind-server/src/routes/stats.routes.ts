import { Router } from 'express';
import { getAppStats, getTravelerStats, getHostStats } from '../controllers/stats.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Public — used on the home page hero/banner
router.get('/', getAppStats);

// Private — traveler-specific stats for their dashboard
router.get('/traveler', authenticate, getTravelerStats);

// Private — host-specific stats for their dashboard
router.get('/host', authenticate, getHostStats);

export default router;
