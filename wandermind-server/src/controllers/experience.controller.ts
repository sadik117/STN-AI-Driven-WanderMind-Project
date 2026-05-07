import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export const getExperiences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = '1', limit = '12', search = '', category = '',
      destinationId = '', minPrice = '', maxPrice = '', sort = 'rating'
    } = req.query as Record<string, string>;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      ...(search && { OR: [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }] }),
      ...(category && { category: { equals: category, mode: 'insensitive' } }),
      ...(destinationId && { destinationId }),
      ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
      ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
    };

    const orderBy: any =
      sort === 'price_asc' ? { price: 'asc' }
      : sort === 'price_desc' ? { price: 'desc' }
      : sort === 'newest' ? { createdAt: 'desc' }
      : { rating: 'desc' };

    const [experiences, total] = await Promise.all([
      prisma.experience.findMany({
        where, orderBy, skip, take: limitNum,
        include: { destination: { select: { name: true, country: true } }, host: { include: { user: { select: { name: true, image: true } } } } },
      }),
      prisma.experience.count({ where }),
    ]);

    sendPaginated(res, experiences, total, pageNum, limitNum, 'Experiences fetched');
  } catch (err) { next(err); }
};

export const getFeaturedExperiences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const experiences = await prisma.experience.findMany({
      where: { featured: true },
      include: { destination: { select: { name: true, country: true } }, host: { include: { user: { select: { name: true, image: true } } } } },
      orderBy: { rating: 'desc' },
      take: 8,
    });
    sendSuccess(res, experiences, 'Featured experiences');
  } catch (err) { next(err); }
};

export const getExperienceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const experience = await prisma.experience.findUnique({
      where: { id: req.params.id as string },
      include: {
        destination: true,
        host: { include: { user: { select: { id: true, name: true, image: true } } } },
        reviews: { include: { author: { select: { name: true, image: true } } }, orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });
    if (!experience) return sendError(res, 'Experience not found', 404);
    sendSuccess(res, experience, 'Experience fetched');
  } catch (err) { next(err); }
};


export const createExperience = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const hostProfile = await prisma.hostProfile.findUnique({ 
      where: { userId: req.user!.id } 
    });
    
    if (!hostProfile) {
      return sendError(res, 'Host profile not found. Please complete your host profile first.', 404);
    }

    const experience = await prisma.experience.create({ 
      data: { 
        ...req.body, 
        hostId: hostProfile.id,
        rating: 0,
        reviewCount: 0
      } 
    });
    
    sendSuccess(res, experience, 'Experience created', 201);
  } catch (err) { 
    next(err); 
  }
};


export const getHostExperiences = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    console.log('Fetching experiences for host user:', userId);
    const { search = '' } = req.query as Record<string, string>;
    
    let hostProfile = await prisma.hostProfile.findUnique({
      where: { userId }
    });
    
    // Auto-create profile if missing but user has HOST role (handles legacy/manual role changes)
    if (!hostProfile) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user && (user.role === 'HOST' || user.role === 'ADMIN')) {
        hostProfile = await prisma.hostProfile.create({
          data: { userId, bio: '', languages: [] }
        });
      } else {
        return sendError(res, 'Host profile not found or unauthorized', 404);
      }
    }
    
    const where: any = {
      hostId: hostProfile.id,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    };
    
    const experiences = await prisma.experience.findMany({
      where,
      include: {
        destination: {
          select: {
            id: true,
            name: true,
            country: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    sendSuccess(res, experiences, 'Host experiences fetched');
  } catch (err) {
    next(err);
  }
};


export const updateExperience = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const experience = await prisma.experience.update({ where: { id: req.params.id as string }, data: req.body });
    sendSuccess(res, experience, 'Experience updated');
  } catch (err) { next(err); }
};


export const deleteExperience = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.experience.delete({ where: { id: req.params.id as string } });
    sendSuccess(res, null, 'Experience deleted');
  } catch (err) { next(err); }
};
