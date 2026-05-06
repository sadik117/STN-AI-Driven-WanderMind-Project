import { Router } from 'express';
import { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } from '../controllers/blog.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', authenticate, requireRole('ADMIN'), createBlog);
router.put('/:id', authenticate, requireRole('ADMIN'), updateBlog);
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteBlog);

export default router;
