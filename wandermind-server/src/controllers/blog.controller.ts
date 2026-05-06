import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';

export const getBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '9', tag = '' } = req.query as Record<string, string>;
    const pageNum = parseInt(page), limitNum = parseInt(limit);
    const where: any = { published: true, ...(tag && { tags: { has: tag } }) };
    const [blogs, total] = await Promise.all([
      prisma.blogPost.findMany({ where, skip: (pageNum - 1) * limitNum, take: limitNum, orderBy: { createdAt: 'desc' }, include: { author: { select: { name: true, image: true } } } }),
      prisma.blogPost.count({ where }),
    ]);
    sendPaginated(res, blogs, total, pageNum, limitNum, 'Blogs fetched');
  } catch (err) { next(err); }
};

export const getBlogBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blog = await prisma.blogPost.findUnique({ where: { slug: req.params.slug }, include: { author: { select: { name: true, image: true } } } });
    if (!blog || !blog.published) return sendError(res, 'Blog not found', 404);
    sendSuccess(res, blog, 'Blog fetched');
  } catch (err) { next(err); }
};

export const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blog = await prisma.blogPost.create({ data: req.body });
    sendSuccess(res, blog, 'Blog created', 201);
  } catch (err) { next(err); }
};

export const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blog = await prisma.blogPost.update({ where: { id: req.params.id }, data: req.body });
    sendSuccess(res, blog, 'Blog updated');
  } catch (err) { next(err); }
};

export const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.blogPost.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 'Blog deleted');
  } catch (err) { next(err); }
};
