'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { DestinationCard, DestinationProps } from '../shared/DestinationCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function PopularDestinations() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['featured-destinations'],
    queryFn: async () => {
      const res = await api.get('/destinations/featured');
      return res.data as DestinationProps[];
    },
  });

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-center text-center mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-foreground">
              Popular Destinations
            </h2>
            <p className="text-muted-foreground text-sm md:text-xl">
              Explore our most loved locations. From pristine beaches to bustling cities, find the perfect spot for your next journey.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-48 w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="pt-6 flex justify-between">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-8 w-1/4 rounded-md" />
                </div>
              </div>
            ))
          ) : isError ? (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/30 rounded-2xl border border-dashed">
              Failed to load destinations. Please try again later.
            </div>
          ) : data && data.length > 0 ? (
            data.slice(0, 4).map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No destinations found.
            </div>
          )}
        </div>
        <div className="flex justify-center mt-10">
          <Link href="/destinations">
            <Button variant="outline" className="gap-2 group">
              View All Destinations
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
