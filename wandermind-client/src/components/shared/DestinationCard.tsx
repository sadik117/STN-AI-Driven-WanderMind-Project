import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
}

export function DestinationCard({ destination }: { destination: DestinationProps }) {
  return (
    <Card className="overflow-hidden flex flex-col h-[380px] group border-border/50 hover:border-primary/30 transition-colors">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={destination.images[0] || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1031&auto=format&fit=crop'}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <Badge variant="secondary" className="bg-white/90 text-black hover:bg-white backdrop-blur-sm shadow-sm">
            {destination.continent}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-md border-none flex items-center gap-1 shadow-sm">
            <Star className="h-3 w-3 fill-accent text-accent" />
            <span className="font-semibold">{destination.rating.toFixed(1)}</span>
          </Badge>
        </div>
      </div>
      
      <CardContent className="flex-1 p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-heading font-bold text-xl line-clamp-1 group-hover:text-primary transition-colors">
              {destination.name}
            </h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              {destination.country}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1.5 mt-3">
          {destination.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        <div>
          <span className="text-sm text-muted-foreground">From </span>
          <span className="font-bold text-lg">${destination.avgCostPerDay}</span>
          <span className="text-sm text-muted-foreground"> /day</span>
        </div>
        <Link href={`/destinations/${destination.slug}`}>
          <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 transition-colors">
            Explore
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
