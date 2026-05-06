import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';
import { io } from '../server';

export const createBooking = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { experienceId, date, guests, notes } = req.body;

    const experience = await prisma.experience.findUnique({ where: { id: experienceId } });
    if (!experience) return sendError(res, 'Experience not found', 404);

    const totalPrice = experience.price * guests;

    const booking = await prisma.booking.create({
      data: { userId: req.user!.id, experienceId, date: new Date(date), guests, totalPrice, notes },
      include: { experience: { include: { host: { include: { user: true } } } } },
    });

    // Send real-time notification to host
    const hostUserId = booking.experience.host.userId;
    const notification = await prisma.notification.create({
      data: {
        userId: hostUserId,
        title: 'New Booking! 🎉',
        message: `${req.user!.name} booked "${experience.title}" for ${new Date(date).toLocaleDateString()}`,
        type: 'booking',
        link: `/dashboard/host/bookings/${booking.id}`,
      },
    });
    io.to(`user:${hostUserId}`).emit('notification', notification);

    sendSuccess(res, booking, 'Booking created successfully', 201);
  } catch (err) { next(err); }
};

export const getMyBookings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '10', status = '' } = req.query as Record<string, string>;
    const pageNum = parseInt(page), limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { userId: req.user!.id, ...(status && { status: status as any }) };

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where, skip, take: limitNum, orderBy: { createdAt: 'desc' },
        include: { experience: { include: { destination: { select: { name: true } } } } },
      }),
      prisma.booking.count({ where }),
    ]);
    sendPaginated(res, bookings, total, pageNum, limitNum, 'Bookings fetched');
  } catch (err) { next(err); }
};

export const getBookingById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { experience: { include: { destination: true, host: { include: { user: { select: { name: true, image: true } } } } } }, user: { select: { name: true, email: true, image: true } } },
    });
    if (!booking) return sendError(res, 'Booking not found', 404);
    sendSuccess(res, booking, 'Booking fetched');
  } catch (err) { next(err); }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status },
      include: { user: true, experience: true },
    });

    // Notify traveler
    const notification = await prisma.notification.create({
      data: {
        userId: booking.userId,
        title: `Booking ${status === 'CONFIRMED' ? 'Confirmed ✅' : 'Cancelled ❌'}`,
        message: `Your booking for "${booking.experience.title}" has been ${status.toLowerCase()}.`,
        type: 'booking',
        link: `/dashboard/traveler/bookings/${booking.id}`,
      },
    });
    io.to(`user:${booking.userId}`).emit('notification', notification);

    sendSuccess(res, booking, 'Booking status updated');
  } catch (err) { next(err); }
};

export const cancelBooking = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
    if (!booking) return sendError(res, 'Booking not found', 404);
    if (booking.userId !== req.user!.id) return sendError(res, 'Not authorized', 403);
    if (booking.status === 'COMPLETED') return sendError(res, 'Cannot cancel a completed booking', 400);

    const updated = await prisma.booking.update({ where: { id: req.params.id }, data: { status: 'CANCELLED' } });
    sendSuccess(res, updated, 'Booking cancelled');
  } catch (err) { next(err); }
};
