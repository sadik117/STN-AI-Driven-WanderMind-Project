import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export const getMyItineraries = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const itineraries = await prisma.itinerary.findMany({
      where: { userId: req.user!.id },
      include: { destination: { select: { name: true, country: true, images: true } } },
      orderBy: { createdAt: 'desc' },
    });
    sendSuccess(res, itineraries, 'Itineraries fetched');
  } catch (err) { next(err); }
};

export const getItineraryById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const itinerary = await prisma.itinerary.findUnique({
      where: { id: req.params.id as string },
      include: { destination: true },
    });
    if (!itinerary) return sendError(res, 'Itinerary not found', 404);
    if (itinerary.userId !== req.user!.id && !itinerary.isPublic) return sendError(res, 'Not authorized', 403);
    sendSuccess(res, itinerary, 'Itinerary fetched');
  } catch (err) { next(err); }
};

export const saveItinerary = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const itinerary = await prisma.itinerary.create({
      data: { ...req.body, userId: req.user!.id },
    });
    sendSuccess(res, itinerary, 'Itinerary saved', 201);
  } catch (err) { next(err); }
};

export const deleteItinerary = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const itinerary = await prisma.itinerary.findUnique({ where: { id: req.params.id as string } });
    if (!itinerary) return sendError(res, 'Itinerary not found', 404);
    if (itinerary.userId !== req.user!.id) return sendError(res, 'Not authorized', 403);
    await prisma.itinerary.delete({ where: { id: req.params.id as string } });
    sendSuccess(res, null, 'Itinerary deleted');
  } catch (err) { next(err); }
};
