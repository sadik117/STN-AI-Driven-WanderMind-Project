import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Admins and Users
  const adminPassword = await bcrypt.hash('demo123', 10);
  const hostPassword = await bcrypt.hash('demo123', 10);
  const travelerPassword = await bcrypt.hash('demo123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@wandermind.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@wandermind.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const hostUser = await prisma.user.upsert({
    where: { email: 'host@wandermind.com' },
    update: {},
    create: {
      name: 'Jane Host',
      email: 'host@wandermind.com',
      password: hostPassword,
      role: 'HOST',
      hostProfile: {
        create: {
          bio: 'Experienced local guide in Bali. I love showing people the hidden gems!',
          verified: true,
          languages: ['English', 'Indonesian'],
        },
      },
    },
  });

  const traveler = await prisma.user.upsert({
    where: { email: 'traveler@wandermind.com' },
    update: {},
    create: {
      name: 'John Traveler',
      email: 'traveler@wandermind.com',
      password: travelerPassword,
      role: 'TRAVELER',
      travelerProfile: {
        create: {
          bio: 'Avid traveler, always looking for the next adventure.',
          travelStyle: ['adventure', 'culture'],
        },
      },
    },
  });

  // Create Destinations
  const bali = await prisma.destination.upsert({
    where: { slug: 'bali-indonesia' },
    update: {},
    create: {
      name: 'Bali',
      slug: 'bali-indonesia',
      country: 'Indonesia',
      continent: 'Asia',
      description: 'The Island of the Gods offers beautiful beaches, lush rice terraces, and a vibrant culture.',
      images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4'],
      tags: ['beach', 'culture', 'nature', 'spiritual'],
      avgCostPerDay: 50,
      rating: 4.8,
      reviewCount: 120,
      climate: 'Tropical',
      bestMonths: ['April', 'May', 'June', 'September', 'October'],
      latitude: -8.4095,
      longitude: 115.1889,
      featured: true,
    },
  });

  const paris = await prisma.destination.upsert({
    where: { slug: 'paris-france' },
    update: {},
    create: {
      name: 'Paris',
      slug: 'paris-france',
      country: 'France',
      continent: 'Europe',
      description: 'The City of Light, famous for its cafe culture, art, fashion, and the Eiffel Tower.',
      images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34'],
      tags: ['city', 'culture', 'food', 'romantic'],
      avgCostPerDay: 150,
      rating: 4.7,
      reviewCount: 340,
      climate: 'Temperate',
      bestMonths: ['April', 'May', 'September', 'October'],
      latitude: 48.8566,
      longitude: 2.3522,
      featured: true,
    },
  });

  // Create Experiences
  const hostProfile = await prisma.hostProfile.findUnique({ where: { userId: hostUser.id } });
  
  if (hostProfile) {
    await prisma.experience.createMany({
      skipDuplicates: true,
      data: [
        {
          title: 'Mount Batur Sunrise Trek',
          description: 'Hike an active volcano and watch the sunrise from the summit.',
          images: ['https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b'],
          price: 45,
          duration: '6 hours',
          category: 'adventure',
          maxGuests: 10,
          location: 'Mount Batur, Bali',
          destinationId: bali.id,
          hostId: hostProfile.id,
          rating: 4.9,
          reviewCount: 45,
          featured: true,
        },
        {
          title: 'Traditional Balinese Cooking Class',
          description: 'Learn to cook authentic Balinese dishes using fresh local ingredients.',
          images: ['https://images.unsplash.com/photo-1556910103-1c02745aae4d'],
          price: 35,
          duration: '4 hours',
          category: 'food',
          maxGuests: 8,
          location: 'Ubud, Bali',
          destinationId: bali.id,
          hostId: hostProfile.id,
          rating: 4.8,
          reviewCount: 32,
        }
      ]
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
