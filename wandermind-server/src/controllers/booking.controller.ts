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
      where: { id: req.params.id as string },
      include: { experience: { include: { destination: true, host: { include: { user: { select: { name: true, image: true } } } } } }, user: { select: { name: true, email: true, image: true } } },
    });
    if (!booking) return sendError(res, 'Booking not found', 404);
    sendSuccess(res, booking, 'Booking fetched');
  } catch (err) { next(err); }
};

// Add to your admin controller file

export const exportBookingsReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = req.query.status as string;
    
    let where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        experience: { select: { title: true, host: { select: { user: { select: { name: true } } } } } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Generate CSV
    const csvHeaders = ['Booking ID', 'Customer Name', 'Customer Email', 'Experience', 'Host', 'Date', 'Guests', 'Total Price', 'Status', 'Payment Status', 'Created At'];
    const csvRows = (bookings as any[]).map(booking => [
      booking.id,
      booking.user?.name || 'N/A',
      booking.user?.email || 'N/A',
      booking.experience?.title || 'N/A',
      (booking.experience?.host as any)?.user?.name || 'N/A',
      new Date(booking.date).toLocaleDateString(),
      booking.guests.toString(),
      booking.totalPrice.toString(),
      booking.status,
      booking.paymentStatus,
      new Date(booking.createdAt).toLocaleString()
    ]);

    const csvContent = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=bookings_${Date.now()}.csv`);
    res.send(csvContent);
  } catch (err) {
    next(err);
  }
};

// Update your updateBookingStatus with better notification handling
export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, notes } = req.body;
    
    // Validate status
    if (!['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      return sendError(res, 'Invalid status', 400);
    }

    // Fetch existing booking to handle notes correctly
    const existingBooking = await prisma.booking.findUnique({
      where: { id: req.params.id as string }
    });

    if (!existingBooking) return sendError(res, 'Booking not found', 404);

    const booking = await prisma.booking.update({
      where: { id: req.params.id as string },
      data: { 
        status,
        notes: notes ? `${existingBooking.notes || ''}\n\n[Admin Note - ${new Date().toISOString()}]: ${notes}`.trim() : existingBooking.notes
      },
      include: { 
        user: true, 
        experience: {
          include: { host: true }
        }
      },
    });

    // Create notification for traveler
    const getNotificationMessage = () => {
      switch (status) {
        case 'CONFIRMED':
          return {
            title: 'Booking Confirmed',
            message: `Great news! Your booking for "${booking.experience.title}" has been confirmed. Get ready for an amazing experience!`
          };
        case 'CANCELLED':
          return {
            title: 'Booking Cancelled',
            message: `Your booking for "${booking.experience.title}" has been cancelled. Any payments made will be refunded within 5-7 business days.`
          };
        case 'COMPLETED':
          return {
            title: 'Booking Completed',
            message: `Your experience "${booking.experience.title}" has been completed. We'd love to hear your feedback!`
          };
        default:
          return {
            title: 'Booking Updated',
            message: `Your booking for "${booking.experience.title}" has been updated to ${status.toLowerCase()}.`
          };
      }
    };

    const notificationMessage = getNotificationMessage();
    
    const notification = await prisma.notification.create({
      data: {
        userId: booking.userId,
        title: notificationMessage.title,
        message: notificationMessage.message,
        type: 'BOOKING_UPDATE',
        link: `/dashboard/traveler/bookings/${booking.id}`,
      },
    });

    // Send real-time notification via socket
    const io = req.app.get('io');
    io.to(`user:${booking.userId}`).emit('notification', notification);
    
    // Also notify host if booking is confirmed or cancelled
    if (booking.experience.hostId && (status === 'CONFIRMED' || status === 'CANCELLED')) {
      const hostNotification = await prisma.notification.create({
        data: {
          userId: booking.experience.hostId,
          title: status === 'CONFIRMED' ? 'Booking Confirmed' : 'Booking Cancelled',
          message: `A booking for "${booking.experience.title}" has been ${status.toLowerCase()} by admin.`,
          type: 'BOOKING_UPDATE',
          link: `/dashboard/host/bookings/${booking.id}`,
        },
      });
      io.to(`user:${booking.experience.hostId}`).emit('notification', hostNotification);
    }

    sendSuccess(res, booking, `Booking ${status.toLowerCase()} successfully`);
  } catch (err) { 
    next(err); 
  }
};

