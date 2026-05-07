import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import cloudinary from '../lib/cloudinary';

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

export const getAdminBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search = '', status = 'ALL', limit = '100' } = req.query as Record<string, string>;
    const limitNum = parseInt(limit);
    
    let where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (status === 'published') {
      where.published = true;
    } else if (status === 'draft') {
      where.published = false;
    }

    const [blogs, total, published, drafts, aiAssisted] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true, image: true } } }
      }),
      prisma.blogPost.count({ where }),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.blogPost.count({ where: { published: false } }),
      prisma.blogPost.count({ where: { aiAssisted: true } })
    ]);

    sendSuccess(res, {
      blogs,
      total,
      published,
      drafts,
      aiAssisted
    });
  } catch (err) { 
    next(err); 
  }
};

export const getBlogBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blog = await prisma.blogPost.findUnique({ where: { slug: req.params.slug as string }, include: { author: { select: { name: true, image: true } } } });
    if (!blog || !blog.published) return sendError(res, 'Blog not found', 404);
    sendSuccess(res, blog, 'Blog fetched');
  } catch (err) { next(err); }
};

export const createBlog = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = { ...req.body, authorId: req.user!.id };
    
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'wandermind/blogs',
      });
      data.coverImage = result.secure_url;
      fs.unlinkSync(req.file.path);
    }
    
    // Parse tags if they come as string
    if (typeof data.tags === 'string') data.tags = JSON.parse(data.tags);
    if (data.published === 'true') data.published = true;
    if (data.published === 'false') data.published = false;
    if (data.aiAssisted === 'true') data.aiAssisted = true;
    if (data.aiAssisted === 'false') data.aiAssisted = false;
    if (data.readingTime) data.readingTime = parseInt(data.readingTime);

    const blog = await prisma.blogPost.create({ data });
    sendSuccess(res, blog, 'Blog created', 201);
  } catch (err) { next(err); }
};

export const updateBlog = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = { ...req.body };
    
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'wandermind/blogs',
      });
      data.coverImage = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    // Parse tags if they come as string
    if (typeof data.tags === 'string') data.tags = JSON.parse(data.tags);
    if (data.published === 'true') data.published = true;
    if (data.published === 'false') data.published = false;
    if (data.aiAssisted === 'true') data.aiAssisted = true;
    if (data.aiAssisted === 'false') data.aiAssisted = false;
    if (data.readingTime) data.readingTime = parseInt(data.readingTime);

    const blog = await prisma.blogPost.update({ 
      where: { id: req.params.id as string }, 
      data 
    });
    sendSuccess(res, blog, 'Blog updated');
  } catch (err) { next(err); }
};

export const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.blogPost.delete({ where: { id: req.params.id as string } });
    sendSuccess(res, null, 'Blog deleted');
  } catch (err) { next(err); }
};
