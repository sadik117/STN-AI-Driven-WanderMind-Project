'use client';

import Link from 'next/link';
import { Clock, Users, Star, MapPin, Heart, Share2, Eye, Calendar, ChevronRight, Award } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export interface ExperienceProps {
  id: string;
  title: string;
  price: number;
  duration: string;
  category: string;
  maxGuests: number;
  location: string;
  images: string[];
  rating: number;
  reviewCount: number;
  featured?: boolean;
  host: {
    user: {
      name: string;
      image?: string;
    };
  };
}

export function ExperienceCard({ experience, featured = false }: { experience: ExperienceProps; featured?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();

  const handleBooking = async (e: React.MouseEvent) => {
    // Prevent any parent click events; like if the whole card was clickable
    e.stopPropagation();

    if (!user) {
      toast.info('Please login to book or see details of this experience');
      router.push('/login');
      return;
    }

    try {
      router.push(`/experiences/${experience.id}`);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Adventure': 'bg-orange-500/90',
      'Food': 'bg-red-500/90',
      'Cultural': 'bg-purple-500/90',
      'Nature': 'bg-green-500/90',
      'Wellness': 'bg-blue-500/90',
      'Sightseeing': 'bg-cyan-500/90',
      'Luxury': 'bg-amber-500/90',
      'Family': 'bg-pink-500/90',
    };
    return colors[category] || 'bg-gray/90';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-amber-500';
    if (rating >= 4.0) return 'text-emerald-500';
    return 'text-blue-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="group overflow-hidden flex flex-col h-[420px] border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 relative bg-card rounded-3xl">

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-2 left-4 z-20">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none shadow-lg px-3 py-1 gap-1">
              <Award className="h-3 w-3" />
              Featured
            </Badge>
          </div>
        )}

        {/* Image Section */}
        <div className="relative h-52 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <img
            src={experience.images[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1031&auto=format&fit=crop'}
            alt={experience.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />

          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-20">
            <Badge
              className={`${getCategoryColor(
                experience.category
              )} backdrop-blur-sm text-white border-none shadow-lg capitalize`}
            >
              {experience.category}
            </Badge>
          </div>

          {/* Rating Badge */}
          <motion.div
            className="absolute top-2.5 right-4 z-20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm rounded-full px-1 shadow-lg">
              <Star
                className={`h-3.5 w-3.5 fill-current ${getRatingColor(
                  experience.rating
                )}`}
              />
              <span className="text-white text-sm font-semibold">
                {experience.rating.toFixed(1)}
              </span>
              <span className="text-white/60 text-xs">
                ({experience.reviewCount})
              </span>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-5 pb-2">
          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span className="truncate">{experience.location}</span>
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300 mb-3">
            {experience.title}
          </h3>

          {/* Host Info */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-5 w-5">
              <AvatarImage src={experience.host?.user?.image} />
              <AvatarFallback className="text-[10px] bg-primary/10">
                {experience.host?.user?.name?.charAt(0) || 'H'}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              Hosted by {experience.host?.user?.name}
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              <span>{experience.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" />
              <span>Up to {experience.maxGuests}</span>
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-5 pt-3 flex items-center justify-between border-t border-border/30 mt-2">
          <div>
            <span className="text-xs text-muted-foreground">From</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">${experience.price}</span>
              <span className="text-sm text-muted-foreground">/ person</span>
            </div>
          </div>

          <Button
            onClick={handleBooking}
            size="sm"
            className="rounded-full gap-1 group/btn bg-primary hover:bg-primary/90"
          >
            <span>Book Now</span>
            <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-3xl" />
        </div>
      </Card>
    </motion.div>
  );
}

// Grid Component for displaying multiple experiences
export function ExperienceGrid({ experiences, featured = false }: { experiences: ExperienceProps[]; featured?: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {experiences.map((experience, index) => (
        <ExperienceCard
          key={experience.id}
          experience={experience}
          featured={featured && index === 0}
        />
      ))}
    </div>
  );
}

// Skeleton Loader
export function ExperienceCardSkeleton() {
  return (
    <div className="rounded-3xl border border-border/50 bg-card overflow-hidden h-[420px] animate-pulse">
      <div className="h-52 bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-muted rounded w-1/3" />
        <div className="h-6 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="flex gap-3 pt-2">
          <div className="h-4 bg-muted rounded w-20" />
          <div className="h-4 bg-muted rounded w-24" />
        </div>
      </div>
      <div className="p-5 pt-3 border-t border-border/30 flex justify-between">
        <div className="space-y-1">
          <div className="h-3 bg-muted rounded w-12" />
          <div className="h-6 bg-muted rounded w-20" />
        </div>
        <div className="h-9 bg-muted rounded-full w-24" />
      </div>
    </div>
  );
}