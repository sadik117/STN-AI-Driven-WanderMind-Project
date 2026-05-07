import { Router } from 'express';
import { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } from '../controllers/blog.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', authenticate,  upload.single('coverImage'), createBlog);
router.put('/:id', authenticate, requireRole('ADMIN'), upload.single('coverImage'), updateBlog);
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteBlog);

export default router;
