'use client';

import Link from 'next/link';
import { MapPin, Star, Heart, ChevronRight, Users, Camera, Sun, Compass, Sparkles } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion } from 'framer-motion';

export interface DestinationProps {
  id: string;
  name: string;
  slug: string;
  country: string;
  continent: string;
  images: string[];
  avgCostPerDay: number;
  rating: number;
  tags: string[];
  description?: string;
  bestTime?: string;
}

export function DestinationCard({ destination, featured = false }: { destination: DestinationProps; featured?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Get gradient based on rating
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'from-amber-500 to-orange-500';
    if (rating >= 4.0) return 'from-emerald-500 to-teal-500';
    return 'from-blue-500 to-cyan-500';
  };

  // Get continent icon
  const getContinentIcon = (continent: string) => {
    switch (continent.toLowerCase()) {
      case 'europe': return <Compass className="h-3 w-3" />;
      case 'asia': return <Sun className="h-3 w-3" />;
      case 'africa': return <Camera className="h-3 w-3" />;
      case 'north america': return <Users className="h-3 w-3" />;
      case 'south america': return <Sparkles className="h-3 w-3" />;
      default: return <MapPin className="h-3 w-3" />;
    }
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
      <Card className="group overflow-hidden flex flex-col h-[400px] border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 relative bg-card rounded-3xl">
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 left-4 z-20">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none shadow-lg px-3 py-1 gap-1">
              <Star className="h-3 w-3 fill-white" />
              Featured
            </Badge>
          </div>
        )}

        {/* Image Container */}
        <div className="relative h-52 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <img
            src={destination.images[0] || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1031&auto=format&fit=crop'}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          
          {/* Image Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Rating Badge - Animated */}
          <motion.div 
            className="absolute top-4 right-4 z-20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Badge className={`bg-gradient-to-r ${getRatingColor(destination.rating)} text-white border-none shadow-lg px-3 py-1.5 gap-1.5`}>
              <Star className="h-3 w-3 fill-white" />
              <span className="font-bold text-sm">{destination.rating.toFixed(1)}</span>
            </Badge>
          </motion.div>

          {/* Quick Info Overlay on Hover */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center z-20 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
          >
            <Button 
              variant="default" 
              size="sm" 
              className="rounded-full gap-2 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
              asChild
            >
              <Link href={`/destinations/${destination.slug}`}>
                Quick View
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
        
        {/* Content */}
        <CardContent className="flex-1 p-5 pb-2">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h3 className="font-heading font-bold text-xl line-clamp-1 group-hover:text-primary transition-colors duration-300">
                {destination.name} 
              </h3>
              <div className="flex items-center text-muted-foreground text-sm mt-1">
                <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                <span className="truncate">{destination.country}</span>
              </div>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {destination.tags.slice(0, 3).map((tag, idx) => (
              <motion.span 
                key={tag} 
                className="text-xs bg-muted/80 hover:bg-primary/10 px-2.5 py-1 rounded-full text-muted-foreground hover:text-primary transition-all cursor-default"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                {tag}
              </motion.span>
            ))}
            {destination.tags.length > 3 && (
              <span className="text-xs bg-muted/50 px-2.5 py-1 rounded-full text-muted-foreground">
                +{destination.tags.length - 3}
              </span>
            )}
          </div>

          {/* Best Time to Visit (if provided) */}
          {destination.bestTime && (
            <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
              <Sun className="h-3 w-3" />
              <span>Best: {destination.bestTime}</span>
            </div>
          )}
        </CardContent>
        
        {/* Footer */}
        <CardFooter className="p-5 pt-3 items-center border-t border-border/30 mt-2">
          <motion.div 
            className="flex items-baseline justify-start gap-0.5"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm text-muted-foreground">From</span>
            <span className="font-bold text-lg text-primary">${destination.avgCostPerDay}</span>
            <span className="text-sm text-muted-foreground">/day</span>
          </motion.div>
        </CardFooter>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-3xl" />
        </div>
      </Card>
    </motion.div>
  );
}

// Grid Layout Component for displaying multiple cards
export function DestinationGrid({ destinations, featured = false }: { destinations: DestinationProps[]; featured?: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {destinations.map((destination, index) => (
        <DestinationCard 
          key={destination.id} 
          destination={destination} 
          featured={featured && index === 0}
        />
      ))}
    </div>
  );
}

// Skeleton Loader for Destination Card
export function DestinationCardSkeleton() {
  return (
    <div className="rounded-3xl border border-border/50 bg-card overflow-hidden h-[400px] animate-pulse">
      <div className="h-52 bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-6 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-6 bg-muted rounded-full w-16" />
          <div className="h-6 bg-muted rounded-full w-20" />
          <div className="h-6 bg-muted rounded-full w-14" />
        </div>
      </div>
      <div className="p-5 pt-3 border-t border-border/30 flex justify-between">
        <div className="h-8 bg-muted rounded w-24" />
        <div className="h-8 bg-muted rounded w-20" />
      </div>
    </div>
  );
}

// Horizontal Scroll Card Component (for hero sections)
export function HorizontalDestinationCard({ destination }: { destination: DestinationProps }) {
  return (
    <motion.div
      whileHover={{ scale: 0.98 }}
      className="relative flex-shrink-0 w-80 rounded-3xl overflow-hidden group cursor-pointer"
    >
      <Link href={`/destinations/${destination.slug}`}>
        <div className="relative h-96">
          <img 
            src={destination.images[0]} 
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-1 mb-2">
              <MapPin className="h-3 w-3" />
              <span className="text-sm">{destination.country}</span>
            </div>
            <h3 className="text-2xl font-bold font-heading mb-2">{destination.name}</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                <span className="text-sm font-semibold">{destination.rating}</span>
              </div>
              <div className="text-sm">
                From <span className="font-bold">${destination.avgCostPerDay}</span>/day
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}