import { Router } from 'express';
import { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog, getMyBlogs } from '../controllers/blog.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/', getBlogs);

router.get('/my-blogs', authenticate, requireRole('HOST', 'TRAVELER'), getMyBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', authenticate, upload.single('coverImage'), createBlog);
router.put('/:id', authenticate, upload.single('coverImage'), updateBlog);
router.delete('/:id', authenticate, deleteBlog);

export default router;
