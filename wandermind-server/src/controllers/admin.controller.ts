import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';

export const getAdminStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get current year's bookings
    const startOfYear = new Date();
    startOfYear.setMonth(0, 1);
    startOfYear.setHours(0, 0, 0, 0);

    const [totalUsers, totalDestinations, totalExperiences, totalBookings, revenueResult, recentBookings, usersByRole, allYearBookings] = await Promise.all([
      prisma.user.count(),
      prisma.destination.count(),
      prisma.experience.count(),
      prisma.booking.count(),
      prisma.booking.aggregate({ _sum: { totalPrice: true }, where: { status: 'COMPLETED' } }),
      prisma.booking.findMany({ 
        take: 10, 
        orderBy: { createdAt: 'desc' }, 
        include: { 
          user: { select: { name: true } }, 
          experience: { select: { title: true } } 
        } 
      }),
      prisma.user.groupBy({ 
        by: ['role'], 
        _count: { role: true } 
      }),
      prisma.booking.findMany({
        where: {
          createdAt: { gte: startOfYear }
        },
        select: {
          createdAt: true,
          totalPrice: true
        }
      })
    ]);

    // Process monthly data manually
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.map((month, index) => {
      const monthBookings = allYearBookings.filter(booking => 
        booking.createdAt.getMonth() === index
      );
      
      return {
        month,
        bookings: monthBookings.length,
        revenue: monthBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)
      };
    });

    const responseData = {
      stats: { 
        totalUsers, 
        totalDestinations, 
        totalExperiences, 
        totalBookings, 
        totalRevenue: revenueResult._sum.totalPrice || 0 
      },
      recentBookings,
      usersByRole: usersByRole.map(role => ({
        role: role.role,
        _count: { role: Number(role._count.role) }
      })),
      monthlyData,
    };

    sendSuccess(res, responseData, 'Admin stats fetched');
  } catch (err) { 
    console.error('Error fetching admin stats:', err);
    next(err); 
  }
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

    sendPaginated(res, users, total, pageNum, limitNum, 'Users fetched successfully', { roleCounts });
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

    sendPaginated(res, bookings, total, pageNum, limitNum, 'Bookings fetched successfully', {
      stats,
      totalRevenue: revenueResult._sum.totalPrice || 0
    });
  } catch (err) { next(err); }
};

export const getAllDestinations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const destinations = await prisma.destination.findMany({ orderBy: { createdAt: 'desc' } });
    sendSuccess(res, destinations, 'Destinations fetched');
  } catch (err) { next(err); }
};
