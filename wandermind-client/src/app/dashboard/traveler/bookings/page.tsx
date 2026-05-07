'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Users, ArrowRight, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function TravelerBookings() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const res = await api.get('/bookings/my-bookings');
      return res.data;
    }
  });

  return (
    <div className="space-y-8">
      <DashboardHeader 
        title="My Bookings" 
        description="View and manage your upcoming and past travel experiences."
      />

      <div className="space-y-6">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))
        ) : bookings && bookings.length > 0 ? (
          bookings.map((booking: any) => (
            <Card key={booking.id} className="overflow-hidden border-border/50 hover:border-primary/30 transition-all group">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-64 h-48 md:h-auto overflow-hidden">
                    <img 
                      src={booking.experience.images[0] || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=500&q=80'} 
                      alt={booking.experience.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                          {booking.experience.category}
                        </Badge>
                        <Badge className={
                          booking.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-500 border-none' :
                          booking.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-none' :
                          'bg-destructive/10 text-destructive border-none'
                        }>
                          {booking.status}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold font-heading mb-4 group-hover:text-primary transition-colors">
                        {booking.experience.title}
                      </h3>
                      <div className="grid grid-cols-2 gap-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 text-primary" />
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary" />
                          {booking.experience.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4 text-primary" />
                          {booking.guests} Guests
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 text-primary" />
                          {booking.experience.duration}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-6 pt-6 border-t">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-muted-foreground">Paid</span>
                        <span className="text-xl font-bold text-foreground">${booking.totalPrice}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          View Receipt
                        </Button>
                        <Link href={`/experiences/${booking.experience.slug}`}>
                          <Button size="sm" className="gap-2">
                            View Experience <ExternalLink className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-20 text-center bg-muted/20 rounded-3xl border border-dashed">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-6">Start your adventure by booking a unique travel experience.</p>
            <Link href="/experiences">
              <Button>Explore Experiences</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
