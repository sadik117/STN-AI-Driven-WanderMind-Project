import { Response, NextFunction } from 'express';
import { Request } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { getCache, setCache } from '../lib/redis';
import { AuthRequest } from '../middleware/auth.middleware';


// Public stats for the home page section
export const getAppStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = 'stats:app';
    const cached = await getCache(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    const [
      totalDestinations,
      totalExperiences,
      totalTravelers,
      totalHosts,
      totalBookings,
      totalItineraries,
      totalReviews,
      totalBlogs,
      featuredDestinations,
      avgRatingResult,
    ] = await Promise.all([
      prisma.destination.count(),
      prisma.experience.count(),
      prisma.travelerProfile.count(),
      prisma.hostProfile.count(),
      prisma.booking.count(),
      prisma.itinerary.count(),
      prisma.review.count(),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.destination.count({ where: { featured: true } }),
      prisma.destination.aggregate({ _avg: { rating: true } }),
    ]);

    const stats = {
      destinations: totalDestinations,
      experiences: totalExperiences,
      travelers: totalTravelers,
      hosts: totalHosts,
      bookings: totalBookings,
      itineraries: totalItineraries,
      reviews: totalReviews,
      blogs: totalBlogs,
      featuredDestinations,
      avgDestinationRating: parseFloat((avgRatingResult._avg.rating ?? 0).toFixed(1)),
    };

    // Cache for 10 minutes
    await setCache(cacheKey, stats, 600);
    return res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};


// Stats for the logged-in traveler's dashboard
export const getTravelerStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const cacheKey = `stats:traveler:${userId}`;
    const cached = await getCache(cacheKey);
    if (cached) return sendSuccess(res, cached, 'Traveler stats fetched');

    const [
      bookings,
      itineraries,
      journalEntries,
      packingLists,
      reviews,
      travelerProfile,
    ] = await Promise.all([
      prisma.booking.findMany({
        where: { userId },
        select: {
          status: true,
          totalPrice: true,
          createdAt: true,
          experience: {
            select: {
              destination: { select: { continent: true } },
            },
          },
        },
      }),
      prisma.itinerary.count({ where: { userId } }),
      prisma.journalEntry.count({ where: { userId } }),
      prisma.packingList.count({ where: { userId } }),
      prisma.review.count({ where: { authorId: userId } }),
      prisma.travelerProfile.findUnique({
        where: { userId },
        select: {
          wishlist: {
            select: { id: true, continent: true, rating: true },
          },
        },
      }),
    ]);

    const totalSpent = bookings.reduce((acc, b) => acc + b.totalPrice, 0);
    const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
    const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;
    const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length;
    const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;

    const wishlist = travelerProfile?.wishlist ?? [];
    const continentsVisited = [
      ...new Set(
        bookings
          .map(b => b.experience?.destination?.continent)
          .filter(Boolean) as string[]
      ),
    ];

    const stats = {
      totalBookings: bookings.length,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      pendingBookings,
      totalSpent: parseFloat(totalSpent.toFixed(2)),
      itineraries,
      journalEntries,
      packingLists,
      reviews,
      wishlist: {
        count: wishlist.length,
        continents: [...new Set(wishlist.map(d => d.continent))],
        avgRating:
          wishlist.length > 0
            ? parseFloat(
                (wishlist.reduce((acc, d) => acc + d.rating, 0) / wishlist.length).toFixed(1)
              )
            : 0,
      },
      continentsVisited,
      countriesVisited: continentsVisited.length, // Approximate
    };

    // Cache for 3 minutes
    await setCache(cacheKey, stats, 180);
    return sendSuccess(res, stats, 'Traveler stats fetched');
  } catch (err) {
    next(err);
  }
};


// Stats for the logged-in host's dashboard
export const getHostStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const hostProfile = await prisma.hostProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!hostProfile) return sendError(res, 'Host profile not found', 404);

    const cacheKey = `stats:host:${userId}`;
    const cached = await getCache(cacheKey);
    if (cached) return sendSuccess(res, cached, 'Host stats fetched');

    const [
      experiences,
      bookings,
      reviews,
    ] = await Promise.all([
      prisma.experience.findMany({
        where: { hostId: hostProfile.id },
        select: {
          id: true,
          title: true,
          rating: true,
          reviewCount: true,
          price: true,
          featured: true,
          category: true,
          _count: { select: { bookings: true } },
          bookings: {
            select: {
              status: true,
              totalPrice: true,
              createdAt: true,
            },
          },
        },
      }),
      prisma.booking.findMany({
        where: {
          experience: { hostId: hostProfile.id },
        },
        select: {
          status: true,
          totalPrice: true,
          createdAt: true,
          guests: true,
        },
      }),
      prisma.review.findMany({
        where: {
          experience: { hostId: hostProfile.id },
        },
        select: { rating: true },
      }),
    ]);

    const totalRevenue = bookings
      .filter(b => b.status === 'COMPLETED' || b.status === 'CONFIRMED')
      .reduce((acc, b) => acc + b.totalPrice, 0);

    const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
    const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;
    const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length;
    const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;

    const totalGuests = bookings.reduce((acc, b) => acc + b.guests, 0);

    const avgRating =
      reviews.length > 0
        ? parseFloat(
            (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
          )
        : 0;

    // Monthly revenue breakdown (last 6 months)
    const now = new Date();
    const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      const monthlyTotal = bookings
        .filter(b => {
          const d = new Date(b.createdAt);
          return (
            d.getMonth() === date.getMonth() &&
            d.getFullYear() === date.getFullYear() &&
            (b.status === 'COMPLETED' || b.status === 'CONFIRMED')
          );
        })
        .reduce((acc, b) => acc + b.totalPrice, 0);
      return { month: label, revenue: parseFloat(monthlyTotal.toFixed(2)) };
    }).reverse();

    // Top performing experience
    const topExperience = experiences.sort(
      (a, b) => b._count.bookings - a._count.bookings
    )[0] ?? null;

    const stats = {
      experiences: {
        total: experiences.length,
        featured: experiences.filter(e => e.featured).length,
        categories: [...new Set(experiences.map(e => e.category))],
      },
      bookings: {
        total: bookings.length,
        confirmed: confirmedBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
        pending: pendingBookings,
      },
      revenue: {
        total: parseFloat(totalRevenue.toFixed(2)),
        monthly: monthlyRevenue,
      },
      guests: {
        total: totalGuests,
        avgPerBooking:
          bookings.length > 0
            ? parseFloat((totalGuests / bookings.length).toFixed(1))
            : 0,
      },
      reviews: {
        total: reviews.length,
        avgRating,
      },
      topExperience: topExperience
        ? {
            id: topExperience.id,
            title: topExperience.title,
            bookings: topExperience._count.bookings,
            rating: topExperience.rating,
          }
        : null,
    };

    // Cache for 3 minutes
    await setCache(cacheKey, stats, 180);
    return sendSuccess(res, stats, 'Host stats fetched');
  } catch (err) {
    next(err);
  }
};
