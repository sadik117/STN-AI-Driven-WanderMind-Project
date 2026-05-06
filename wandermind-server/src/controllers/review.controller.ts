import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export const getReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { destinationId, experienceId, page = '1', limit = '10' } = req.query as Record<string, string>;
    const pageNum = parseInt(page), limitNum = parseInt(limit);
    const where: any = { ...(destinationId && { destinationId }), ...(experienceId && { experienceId }) };

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({ where, skip: (pageNum - 1) * limitNum, take: limitNum, orderBy: { createdAt: 'desc' }, include: { author: { select: { name: true, image: true } } } }),
      prisma.review.count({ where }),
    ]);
    sendPaginated(res, reviews, total, pageNum, limitNum, 'Reviews fetched');
  } catch (err) { next(err); }
};

export const createReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const review = await prisma.review.create({
      data: { ...req.body, authorId: req.user!.id },
      include: { author: { select: { name: true, image: true } } },
    });

    // Update rating average
    if (req.body.destinationId) {
      const agg = await prisma.review.aggregate({ where: { destinationId: req.body.destinationId }, _avg: { rating: true }, _count: true });
      await prisma.destination.update({ where: { id: req.body.destinationId }, data: { rating: agg._avg.rating || 0, reviewCount: agg._count } });
    }
    if (req.body.experienceId) {
      const agg = await prisma.review.aggregate({ where: { experienceId: req.body.experienceId }, _avg: { rating: true }, _count: true });
      await prisma.experience.update({ where: { id: req.body.experienceId }, data: { rating: agg._avg.rating || 0, reviewCount: agg._count } });
    }

    sendSuccess(res, review, 'Review submitted', 201);
  } catch (err) { next(err); }
};

export const deleteReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!review) return sendError(res, 'Review not found', 404);
    if (review.authorId !== req.user!.id && req.user!.role !== 'ADMIN') return sendError(res, 'Not authorized', 403);
    await prisma.review.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 'Review deleted');
  } catch (err) { next(err); }
};
