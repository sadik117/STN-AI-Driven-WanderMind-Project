import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';
import { deleteCachePattern } from '../lib/redis';

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
    const { bookingId, rating, content, experienceId, destinationId } = req.body;

    if (bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId }
      });

      if (!booking) return sendError(res, 'Booking not found', 404);
      if (booking.userId !== req.user!.id) return sendError(res, 'Unauthorized', 403);
      if (booking.status !== 'COMPLETED') return sendError(res, 'You can only review completed experiences', 400);
    }

    const review = await prisma.review.create({
      data: { 
        rating, 
        content, 
        authorId: req.user!.id,
        experienceId,
        destinationId,
      },
      include: { author: { select: { name: true, image: true } } },
    });

    // Update rating average
    if (destinationId) {
      const agg = await prisma.review.aggregate({ where: { destinationId }, _avg: { rating: true }, _count: true });
      await prisma.destination.update({ where: { id: destinationId }, data: { rating: agg._avg.rating || 0, reviewCount: agg._count } });
    }
    if (experienceId) {
      const agg = await prisma.review.aggregate({ where: { experienceId }, _avg: { rating: true }, _count: true });
      await prisma.experience.update({ where: { id: experienceId }, data: { rating: agg._avg.rating || 0, reviewCount: agg._count } });
    }

    // Notify Host if it's an experience review
    if (experienceId) {
      const experience = await prisma.experience.findUnique({ where: { id: experienceId }, include: { host: true } });
      if (experience) {
        const notification = await prisma.notification.create({
          data: {
            userId: experience.host.userId,
            title: 'New Review!',
            message: `${req.user!.name} left a ${rating}-star review for "${experience.title}"`,
            type: 'REVIEW',
            link: `/dashboard/host/experiences/${experienceId}`,
          }
        });
        const io = req.app.get('io');
        if (io) io.to(`user:${experience.host.userId}`).emit('notification', notification);
      }
    }

    // Invalidate caches
    await deleteCachePattern('destinations:*');
    await deleteCachePattern('experiences:*');

    sendSuccess(res, review, 'Review submitted successfully', 201);
  } catch (err) { next(err); }
};

export const deleteReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id as any } });
    if (!review) return sendError(res, 'Review not found', 404);
    if (review.authorId !== req.user!.id && req.user!.role !== 'ADMIN') return sendError(res, 'Not authorized', 403);
    await prisma.review.delete({ where: { id: req.params.id as any } });

    // Invalidate caches
    await deleteCachePattern('destinations:*');
    await deleteCachePattern('experiences:*');

    sendSuccess(res, null, 'Review deleted');
  } catch (err) { next(err); }
};
