import { Router } from 'express';
import { uploadImage } from '../controllers/upload.controller';
import { upload } from '../middleware/upload.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public or protected? User said for registration (public) and admin (protected).
// Let's make a general one, but for registration we might need it public.
router.post('/image', upload.single('image'), uploadImage);

export default router;
