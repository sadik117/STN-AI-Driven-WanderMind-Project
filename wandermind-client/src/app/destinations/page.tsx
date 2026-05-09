'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { DestinationCard, DestinationProps } from '@/components/shared/DestinationCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DestinationsPage() {
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['destinations', search],
    queryFn: async () => {
      const res = await api.get('/destinations', {
        params: { search }
      });
      // console.log(res.data);
      return res.data as DestinationProps[];
    },
  });

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative py-20 bg-muted/30 border-b overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-foreground tracking-tight">
              Discover Your Next <span className="text-primary italic">Adventure</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              From the crystal clear waters of the Maldives to the snow-capped peaks of the Swiss Alps. Find the world's most breathtaking destinations.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search destinations, countries, or continents..." 
                className="pl-12 h-14 bg-background shadow-xl border-border/50 rounded-2xl text-lg focus-visible:ring-primary/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold font-heading">Explore All</h2>
            <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {data?.length || 0} results
            </span>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-56 w-full rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="pt-4 flex justify-between">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-10 w-1/4 rounded-xl" />
                </div>
              </div>
            ))
          ) : isError ? (
            <div className="col-span-full py-20 text-center">
              <div className="bg-destructive/10 text-destructive p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Error Loading Destinations</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're having trouble fetching destinations right now. Please try refreshing the page.
              </p>
              <Button className="mt-6" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : data && data.length > 0 ? (
            data.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-muted/20 rounded-3xl border border-dashed">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Destinations Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button variant="outline" className="mt-6" onClick={() => setSearch('')}>
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
