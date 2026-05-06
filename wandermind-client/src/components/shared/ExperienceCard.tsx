import Link from 'next/link';
import { Clock, Users, Star, MapPin } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  host: {
    user: {
      name: string;
      image?: string;
    };
  };
}

export function ExperienceCard({ experience }: { experience: ExperienceProps }) {
  return (
    <Card className="overflow-hidden flex flex-col h-[400px] group border-border/50 hover:border-primary/30 transition-colors">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={experience.images[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1031&auto=format&fit=crop'}
          alt={experience.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-primary/90 hover:bg-primary backdrop-blur-sm shadow-sm capitalize">
            {experience.category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="flex-1 p-5 pb-2">
        <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            <span className="text-foreground">{experience.rating.toFixed(1)}</span>
            <span>({experience.reviewCount})</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate max-w-[120px]">{experience.location}</span>
          </div>
        </div>
        
        <h3 className="font-heading font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors mb-3">
          {experience.title}
        </h3>
        
        <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-auto">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0" />
            <span>{experience.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0" />
            <span>Up to {experience.maxGuests} guests</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-4 flex items-center justify-between border-t border-border/50">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">From</span>
          <div className="font-bold text-lg text-foreground">
            ${experience.price} <span className="text-sm font-normal text-muted-foreground">/ person</span>
          </div>
        </div>
        
        <Link href={`/experiences/${experience.id}`} className="text-sm font-semibold text-primary hover:underline">
          Book Now
        </Link>
      </CardFooter>
    </Card>
  );
}
