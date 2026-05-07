'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock, Users, SlidersHorizontal, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

interface Experience {
  id: string;
  title: string;
  slug: string;
  location: string;
  images: string[];
  price: number;
  rating: number;
  reviewsCount: number;
  duration: string;
  maxGroupSize: number;
  category: string;
}

export default function ExperiencesPage() {
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['experiences', search],
    queryFn: async () => {
      const res = await api.get('/experiences', {
        params: { search }
      });
      return res.data as Experience[];
    },
  });

  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="bg-primary/5 py-20 border-b relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 tracking-tight">
            Unforgettable <span className="text-primary italic">Experiences</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            From local cooking classes to extreme adventures. Book unique activities led by expert hosts.
          </p>
          
          <div className="relative max-w-xl group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search experiences, tours, activities..." 
              className="pl-12 h-14 bg-background shadow-xl border-border/50 rounded-2xl text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {['All', 'Adventure', 'Food & Drink', 'Culture', 'Nature', 'Wellness'].map((cat) => (
              <Button key={cat} variant={cat === 'All' ? 'default' : 'outline'} className="rounded-full whitespace-nowrap">
                {cat}
              </Button>
            ))}
          </div>
          <Button variant="outline" className="gap-2 hidden md:flex">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))
          ) : isError ? (
            <div className="col-span-full py-20 text-center text-destructive">
              Failed to load experiences.
            </div>
          ) : data && data.length > 0 ? (
            data.map((exp) => (
              <Card key={exp.id} className="group border-border/50 hover:border-primary/30 transition-all shadow-sm hover:shadow-xl overflow-hidden rounded-3xl">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={exp.images[0] || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop'} 
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-black border-none backdrop-blur-sm">
                      {exp.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 right-4 h-10 w-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-primary shadow-lg cursor-pointer hover:bg-primary hover:text-white transition-colors">
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-1 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                    <MapPin className="h-3 w-3" />
                    {exp.location}
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                    {exp.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {exp.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      Up to {exp.maxGroupSize}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-border/30 mt-2 pt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-muted-foreground">From</span>
                    <span className="text-xl font-bold">${exp.price}</span>
                    <span className="text-sm text-muted-foreground">/ person</span>
                  </div>
                  <Link href={`/experiences/${exp.slug}`}>
                    <Button variant="ghost" size="sm" className="font-bold text-primary group/btn">
                      Book Now 
                      <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-muted/20 rounded-3xl">
              <p className="text-muted-foreground">No experiences found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Re-using ArrowRight for imports
const ArrowRightIcon = ArrowRight;
