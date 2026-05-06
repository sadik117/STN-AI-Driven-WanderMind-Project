import { Router } from 'express';
import {
  getExperiences, getExperienceById, createExperience,
  updateExperience, deleteExperience, getFeaturedExperiences
} from '../controllers/experience.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getExperiences);
router.get('/featured', getFeaturedExperiences);
router.get('/:id', getExperienceById);
router.post('/', authenticate, requireRole('HOST', 'ADMIN'), createExperience);
router.put('/:id', authenticate, requireRole('HOST', 'ADMIN'), updateExperience);
router.delete('/:id', authenticate, requireRole('HOST', 'ADMIN'), deleteExperience);

export default router;
