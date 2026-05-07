import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { getCache, setCache, deleteCache, deleteCachePattern } from '../lib/redis';
import { AuthRequest } from '../middleware/auth.middleware';

export const getDestinations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = '1', limit = '12', search = '', continent = '',
      minCost = '', maxCost = '', sort = 'rating', climate = ''
    } = req.query as Record<string, string>;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const cacheKey = `destinations:${JSON.stringify(req.query)}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const where: any = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { country: { contains: search, mode: 'insensitive' } },
          { tags: { has: search } },
        ],
      }),
      ...(continent && { continent: { equals: continent, mode: 'insensitive' } }),
      ...(climate && { climate: { equals: climate, mode: 'insensitive' } }),
      ...(minCost && { avgCostPerDay: { gte: parseFloat(minCost) } }),
      ...(maxCost && { avgCostPerDay: { lte: parseFloat(maxCost) } }),
    };

    const orderBy: any =
      sort === 'cost_asc' ? { avgCostPerDay: 'asc' }
      : sort === 'cost_desc' ? { avgCostPerDay: 'desc' }
      : sort === 'newest' ? { createdAt: 'desc' }
      : { rating: 'desc' };

    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({ where, orderBy, skip, take: limitNum }),
      prisma.destination.count({ where }),
    ]);

    const response = { success: true, message: 'Destinations fetched', data: destinations, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum), hasNext: pageNum * limitNum < total, hasPrev: pageNum > 1 } };
    await setCache(cacheKey, response, 3600); // 1 hour cache
    res.json(response);
  } catch (err) {
    next(err);
  }
};

export const getFeaturedDestinations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cached = await getCache<any[]>('destinations:featured');
    if (cached) return sendSuccess(res, cached, 'Featured destinations');

    const destinations = await prisma.destination.findMany({
      where: { featured: true },
      orderBy: { rating: 'desc' },
      take: 8,
    });
    await setCache('destinations:featured', destinations, 3600);
    sendSuccess(res, destinations, 'Featured destinations');
  } catch (err) {
    next(err);
  }
};

export const getDestinationBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug as string;
    const cacheKey = `destination:${slug}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    const destination = await prisma.destination.findUnique({
      where: { slug },
      include: {
        experiences: { include: { host: { include: { user: { select: { name: true, image: true } } } } }, take: 6 },
        reviews: { include: { author: { select: { name: true, image: true } } }, take: 10, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!destination) return sendError(res, 'Destination not found', 404);

    await setCache(cacheKey, destination, 1800);
    sendSuccess(res, destination, 'Destination fetched');
  } catch (err) {
    next(err);
  }
};

export const createDestination = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const destination = await prisma.destination.create({ data: req.body });
    await deleteCachePattern('destinations:*');
    sendSuccess(res, destination, 'Destination created', 201);
  } catch (err) {
    next(err);
  }
};

export const updateDestination = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const destination = await prisma.destination.update({ where: { id }, data: req.body });
    await deleteCachePattern('destinations:*');
    await deleteCache(`destination:${destination.slug}`);
    sendSuccess(res, destination, 'Destination updated');
  } catch (err) {
    next(err);
  }
};

export const deleteDestination = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await prisma.destination.delete({ where: { id } });
    await deleteCachePattern('destinations:*');
    sendSuccess(res, null, 'Destination deleted');
  } catch (err) {
    next(err);
  }
};

export const toggleWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const profile = await prisma.travelerProfile.findUnique({
      where: { userId },
      include: { wishlist: { where: { id }, select: { id: true } } },
    });
    if (!profile) return sendError(res, 'Traveler profile not found', 404);

    const isWishlisted = profile.wishlist.length > 0;
    await prisma.travelerProfile.update({
      where: { userId },
      data: {
        wishlist: isWishlisted
          ? { disconnect: { id } }
          : { connect: { id } },
      },
    });
    sendSuccess(res, { wishlisted: !isWishlisted }, isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  } catch (err) {
    next(err);
  }
};
