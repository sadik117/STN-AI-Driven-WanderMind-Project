import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true, name: true, email: true, role: true, image: true, createdAt: true,
        travelerProfile: { include: { wishlist: { select: { id: true, name: true, slug: true, images: true } } } },
        hostProfile: true,
        _count: { select: { bookings: true, reviews: true, itineraries: true } },
      },
    });
    sendSuccess(res, user, 'Profile fetched');
  } catch (err) { next(err); }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, image, bio, nationality, travelStyle } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(name && { name }),
        ...(image && { image }),
        travelerProfile: {
          upsert: {
            create: { bio, nationality, travelStyle: travelStyle || [] },
            update: { bio, nationality, travelStyle: travelStyle || [] },
          },
        },
      },
      select: { id: true, name: true, email: true, role: true, image: true, travelerProfile: true },
    });
    sendSuccess(res, user, 'Profile updated');
  } catch (err) { next(err); }
};

export const getNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    const unreadCount = notifications.filter(n => !n.read).length;
    sendSuccess(res, { notifications, unreadCount }, 'Notifications fetched');
  } catch (err) { next(err); }
};

export const markNotificationRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.notification.update({ where: { id: req.params.id }, data: { read: true } });
    sendSuccess(res, null, 'Notification marked as read');
  } catch (err) { next(err); }
};

export const getMyJournals = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const journals = await prisma.journalEntry.findMany({
      where: { userId: req.user!.id },
      orderBy: { travelDate: 'desc' },
    });
    sendSuccess(res, journals, 'Journals fetched');
  } catch (err) { next(err); }
};

export const createJournal = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const journal = await prisma.journalEntry.create({
      data: { ...req.body, userId: req.user!.id, travelDate: new Date(req.body.travelDate) },
    });
    sendSuccess(res, journal, 'Journal saved', 201);
  } catch (err) { next(err); }
};

export const getMyPackingLists = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const lists = await prisma.packingList.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });
    sendSuccess(res, lists, 'Packing lists fetched');
  } catch (err) { next(err); }
};
