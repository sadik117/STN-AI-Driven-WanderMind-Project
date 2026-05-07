import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAdminStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalUsers, totalDestinations, totalExperiences, totalBookings, revenueResult, recentBookings, usersByRole] = await Promise.all([
      prisma.user.count(),
      prisma.destination.count(),
      prisma.experience.count(),
      prisma.booking.count(),
      prisma.booking.aggregate({ _sum: { totalPrice: true }, where: { status: 'COMPLETED' } }),
      prisma.booking.findMany({ take: 10, orderBy: { createdAt: 'desc' }, include: { user: { select: { name: true } }, experience: { select: { title: true } } } }),
      prisma.user.groupBy({ by: ['role'], _count: { role: true } }),
    ]);

    sendSuccess(res, {
      stats: { totalUsers, totalDestinations, totalExperiences, totalBookings, totalRevenue: revenueResult._sum.totalPrice || 0 },
      recentBookings,
      usersByRole,
    }, 'Admin stats fetched');
  } catch (err) { next(err); }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', search = '', role = '' } = req.query as Record<string, string>;
    const pageNum = parseInt(page), limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      ...(search && { OR: [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }] }),
      ...(role && { role: role as any }),
    };

    const [users, total, roleGroups] = await Promise.all([
      prisma.user.findMany({ where, skip, take: limitNum, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, email: true, role: true, image: true, createdAt: true } }),
      prisma.user.count({ where }),
      prisma.user.groupBy({ by: ['role'], _count: { role: true } }),
    ]);

    const roleCounts = roleGroups.reduce((acc: any, group) => {
      acc[group.role] = group._count.role;
      return acc;
    }, {});

    res.json({
      success: true,
      message: 'Users fetched successfully',
      data: users,
      roleCounts,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      }
    });
  } catch (err) { next(err); }
};

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.update({ where: { id: req.params.id as string }, data: { role: req.body.role }, select: { id: true, name: true, email: true, role: true } });
    sendSuccess(res, user, 'User role updated successfully');
  } catch (err) { next(err); }
};

export const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '10' } = req.query as Record<string, string>;
    const pageNum = parseInt(page), limitNum = parseInt(limit);
    const [bookings, total, statusGroups, revenueResult] = await Promise.all([
      prisma.booking.findMany({ skip: (pageNum - 1) * limitNum, take: limitNum, orderBy: { createdAt: 'desc' }, include: { user: { select: { name: true, email: true } }, experience: { select: { title: true, price: true } } } }),
      prisma.booking.count(),
      prisma.booking.groupBy({ by: ['status'], _count: { status: true } }),
      prisma.booking.aggregate({ _sum: { totalPrice: true }, where: { status: 'COMPLETED' } }),
    ]);

    const stats = statusGroups.reduce((acc: any, group) => {
      acc[group.status] = group._count.status;
      return acc;
    }, {});

    res.json({
      success: true,
      message: 'Bookings fetched successfully',
      data: bookings,
      total,
      stats,
      totalRevenue: revenueResult._sum.totalPrice || 0,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      }
    });
  } catch (err) { next(err); }
};

export const getAllDestinations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const destinations = await prisma.destination.findMany({ orderBy: { createdAt: 'desc' } });
    sendSuccess(res, destinations, 'Destinations fetched');
  } catch (err) { next(err); }
};
