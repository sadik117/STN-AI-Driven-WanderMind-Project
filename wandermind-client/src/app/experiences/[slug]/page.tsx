'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Calendar, 
  Info, 
  CheckCircle2, 
  Share2, 
  Heart,
  MessageSquare,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ExperienceDetailPage() {
  const { slug } = useParams();
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState('');

  const { data: experience, isLoading, isError } = useQuery({
    queryKey: ['experience', slug],
    queryFn: async () => {
      const res = await api.get(`/experiences/slug/${slug}`);
      return res.data;
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      return await api.post('/bookings', bookingData);
    },
    onSuccess: () => {
      toast.success('Experience booked successfully! Check your dashboard.');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to book experience. Please log in.');
    }
  });

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return toast.error('Please select a date');
    
    bookingMutation.mutate({
      experienceId: experience.id,
      date,
      guests,
      totalPrice: experience.price * guests
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <Skeleton className="h-[500px] w-full rounded-3xl" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-[400px] w-full rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !experience) return <div className="py-24 text-center">Experience not found</div>;

  return (
    <div className="pb-24">
      {/* Photo Gallery Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          <div className="md:col-span-2 md:row-span-2 overflow-hidden">
            <img src={experience.images[0]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="overflow-hidden">
            <img src={experience.images[1] || experience.images[0]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="overflow-hidden">
            <img src={experience.images[2] || experience.images[0]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="overflow-hidden">
            <img src={experience.images[3] || experience.images[0]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="overflow-hidden relative">
            <img src={experience.images[4] || experience.images[0]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            <Button variant="secondary" className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md">View All Photos</Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-primary/10 text-primary border-none">{experience.category}</Badge>
                <Badge variant="outline" className="gap-1"><Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {experience.rating} (124 reviews)</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 tracking-tight">{experience.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground pb-8 border-b">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">{experience.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">{experience.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Up to {experience.maxGroupSize} guests</span>
                </div>
              </div>
            </div>

            {/* Host Info */}
            <div className="flex items-center justify-between p-6 bg-muted/30 rounded-3xl border border-border/50">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-background shadow-sm">
                  {experience.host?.user?.image ? (
                    <img src={experience.host.user.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Users className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Hosted by</p>
                  <h4 className="text-xl font-bold">{experience.host?.user?.name || 'Local Expert'}</h4>
                </div>
              </div>
              <Button variant="outline" className="rounded-xl">Contact Host</Button>
            </div>

            <div className="prose prose-lg max-w-none dark:prose-invert">
              <h2 className="text-2xl font-bold font-heading mb-4">Experience Overview</h2>
              <p className="text-muted-foreground leading-relaxed">
                {experience.description || "Join us for an unforgettable journey through the local culture and hidden gems. This experience is designed to provide you with a deep understanding of the traditions and beauty of our region, led by passionate local experts who know the best spots far from the typical tourist trails."}
              </p>
              
              <h3 className="text-xl font-bold font-heading mt-8 mb-4">What's Included</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
                {['Local Guide', 'Transport', 'Refreshments', 'Equipment', 'Entry Fees'].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-12 border-t">
              <h2 className="text-2xl font-bold font-heading mb-8">What guests are saying</h2>
              <div className="space-y-8">
                {[1, 2].map(i => (
                  <div key={i} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted overflow-hidden" />
                      <div>
                        <p className="font-bold">Traveler {i}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex text-amber-500"><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" /></div>
                          <span className="text-xs text-muted-foreground">2 weeks ago</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground italic">"An absolutely incredible experience! The guide was so knowledgeable and took us to places we never would have found on our own. Highly recommend to anyone visiting!"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-4">
            <Card className="sticky top-24 rounded-3xl border-border/50 shadow-2xl overflow-hidden">
              <div className="p-6 bg-primary text-primary-foreground flex justify-between items-center">
                <div>
                  <span className="text-3xl font-bold">${experience.price}</span>
                  <span className="text-sm opacity-80"> / person</span>
                </div>
                <Badge className="bg-white/20 hover:bg-white/30 border-none">
                  Best Value
                </Badge>
              </div>
              <CardContent className="p-8 space-y-6">
                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="date" className="text-sm font-semibold uppercase tracking-wider">Select Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="date" 
                        type="date" 
                        className="h-12 pl-10 rounded-xl"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="guests" className="text-sm font-semibold uppercase tracking-wider">Number of Guests</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="guests" 
                        type="number" 
                        min="1" 
                        max={experience.maxGroupSize}
                        className="h-12 pl-10 rounded-xl"
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-4 space-y-3 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">${experience.price} x {guests} guests</span>
                      <span className="font-medium">${experience.price * guests}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service fee</span>
                      <span className="font-medium text-emerald-500">FREE</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 text-xl font-bold border-t">
                      <span>Total</span>
                      <span>${experience.price * guests}</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-14 rounded-xl text-lg font-bold gap-2 shadow-xl shadow-primary/25" disabled={bookingMutation.isPending}>
                    {bookingMutation.isPending ? 'Processing...' : (
                      <><Zap className="h-5 w-5" /> Reserve Now</>
                    )}
                  </Button>
                </form>

                <div className="space-y-4 pt-6 text-xs text-muted-foreground border-t">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>WanderMind Guarantee - Safe & secure payment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Info className="h-4 w-4 text-blue-500" />
                    <span>Free cancellation up to 48 hours before the start</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
