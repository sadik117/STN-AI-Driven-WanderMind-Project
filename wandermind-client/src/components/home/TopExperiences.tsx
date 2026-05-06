'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ExperienceCard, ExperienceProps } from '../shared/ExperienceCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function TopExperiences() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['featured-experiences'],
    queryFn: async () => {
      const res = await api.get('/experiences/featured');
      return res.data as ExperienceProps[];
    },
  });

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">
            Unforgettable Local Experiences
          </h2>
          <p className="text-muted-foreground text-lg">
            Led by passionate local hosts, discover activities that will make your trip truly special.
          </p>
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
              Failed to load experiences. Please try again later.
            </div>
          ) : data && data.length > 0 ? (
            data.slice(0, 4).map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No experiences found.
            </div>
          )}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/experiences">
            <Button size="lg" variant="outline" className="h-12 px-8">
              Browse All Experiences
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
