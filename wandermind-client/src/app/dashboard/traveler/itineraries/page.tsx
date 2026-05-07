'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Map, Calendar, Clock, Share2, Trash2, Plus, Sparkles, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function TravelerItineraries() {
  const { data: itineraries, isLoading } = useQuery({
    queryKey: ['my-itineraries'],
    queryFn: async () => {
      const res = await api.get('/itineraries/my-itineraries');
      return res.data;
    }
  });

  return (
    <div className="space-y-8">
      <DashboardHeader 
        title="My Itineraries" 
        description="View and manage your AI-generated travel plans."
      >
        <Link href="/ai-planner">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Plan New Trip
          </Button>
        </Link>
      </DashboardHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-3xl" />
          ))
        ) : itineraries && itineraries.length > 0 ? (
          itineraries.map((itinerary: any) => (
            <Card key={itinerary.id} className="group overflow-hidden rounded-3xl border-border/50 hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5 bg-card flex flex-col">
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&q=80`} 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-1 text-xs font-medium">
                    <Calendar className="h-3 w-3" />
                    {new Date(itinerary.createdAt).toLocaleDateString()}
                  </div>
                  <Badge className="bg-primary/20 backdrop-blur-md border-none text-white text-[10px]">
                    {itinerary.days} Days
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold font-heading mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> {itinerary.destination}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1 italic">
                  "{itinerary.itinerary.substring(0, 150)}..."
                </p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-xl gap-2 font-bold group/btn">
                    View Plan
                    <Sparkles className="h-3 w-3 group-hover/btn:rotate-12 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-muted/20 rounded-3xl border border-dashed">
            <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No itineraries found</h3>
            <p className="text-muted-foreground mb-6">Let our AI build the perfect trip for you.</p>
            <Link href="/ai-planner">
              <Button className="gap-2">
                <Sparkles className="h-4 w-4" />
                Start Planning
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
