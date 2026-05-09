'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Calendar, 
  CheckCircle2, 
  Share2, 
  Heart,
  MessageSquare,
  ShieldCheck,
  Zap,
  Award,
  Coffee,
  Camera,
  Wifi,
  Car,
  Utensils,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2
} from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

export default function ExperienceDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const { data: experience, isLoading, isError } = useQuery({
    queryKey: ['experience', slug],
    queryFn: async () => {
      const res = await api.get(`/experiences/${slug}`);
      return res.data;
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      return await api.post('/bookings', bookingData);
    },
    onSuccess: () => {
      toast.success('Experience booked successfully! Check your dashboard.', {
        duration: 5000,
        icon: '🎉',
      });
      router.push('/dashboard/traveler/bookings');
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        toast.error('Please log in to book this experience');
        router.push('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to book experience');
      }
    }
  });

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast.error('Please select a date');
      return;
    }
    
    bookingMutation.mutate({
      experienceId: experience.id,
      date,
      guests,
      totalPrice: experience.price * guests
    });
  };

  const handleContactHost = () => {
    toast('Contact with host service will be available soon !!',{
      duration: 5000,
      icon: '😊',
    });
  };

  if (isLoading) {
    return <ExperienceDetailSkeleton />;
  }

  if (isError || !experience) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">😢</div>
        <h1 className="text-2xl font-bold mb-2">Experience Not Found</h1>
        <p className="text-muted-foreground mb-6">The experience you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push('/experiences')} className="rounded-xl">
          Browse Experiences
        </Button>
      </div>
    );
  }

  const allImages = experience.images || [];
  const totalPrice = experience.price * guests;
  const includedItems = [
    'Local expert guide', 'All equipment', 'Refreshments', 'Entry fees',
    'Insurance coverage', 'Photo package', 'Certificate of completion'
  ];

  return (
    <div className="pb-24">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="gap-2 rounded-xl hover:bg-primary/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Experiences
        </Button>
      </div>

      {/* Photo Gallery */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-3 h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          <div className="md:col-span-2 md:row-span-2 overflow-hidden relative group cursor-pointer" onClick={() => { setSelectedImage(0); setIsGalleryOpen(true); }}>
            <img src={allImages[0]} alt={experience.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 className="h-8 w-8 text-white" />
            </div>
          </div>
          {allImages.slice(1, 5).map((img: string, idx: number) => (
            <div key={idx} className="overflow-hidden relative group cursor-pointer" onClick={() => { setSelectedImage(idx + 1); setIsGalleryOpen(true); }}>
              <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize2 className="h-6 w-6 text-white" />
              </div>
              {idx === 3 && allImages.length > 5 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">+{allImages.length - 5}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* Header */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-primary/10 text-primary border-none px-3 py-1">
                  {experience.category}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  {experience.rating?.toFixed(1) || 'New'} ({experience.reviewCount || 0} reviews)
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Users className="h-3 w-3" />
                  {experience.maxGuests} max guests
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 tracking-tight">
                {experience.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground pb-6 border-b">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">{experience.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">{experience.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Available daily</span>
                </div>
              </div>
            </div>

            {/* Host Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-3xl border border-primary/20"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center overflow-hidden border-3 border-background shadow-lg">
                  {experience.host?.user?.image ? (
                    <img src={experience.host.user.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      {experience.host?.user?.name?.charAt(0) || 'H'}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Hosted by</p>
                  <h4 className="text-xl font-bold">{experience.host?.user?.name || 'Local Expert'}</h4>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Award className="h-3 w-3 text-primary" />
                    <span>Verified Host • 50+ experiences hosted</span>
                  </div>
                </div>
              </div>
              <Button onClick={handleContactHost} variant="outline" className="rounded-xl gap-2">
                <MessageSquare className="h-4 w-4" />
                Contact Host
              </Button>
            </motion.div>

            {/* Description Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-xl bg-muted/50 p-1">
                <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
                <TabsTrigger value="included" className="rounded-lg">What's Included</TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-lg">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="pt-6">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {experience.description || "Join us for an unforgettable journey through the local culture and hidden gems. This experience is designed to provide you with a deep understanding of the traditions and beauty of our region, led by passionate local experts who know the best spots far from the typical tourist trails."}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="included" className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {includedItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="font-medium">Free cancellation up to 48 hours</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="pt-6">
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-3 p-4 bg-muted/10 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-bold">JD</span>
                          </div>
                          <div>
                            <p className="font-semibold">John Doe</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, idx) => (
                                <Star key={idx} className="h-3 w-3 fill-amber-500 text-amber-500" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">2 weeks ago</span>
                      </div>
                      <p className="text-muted-foreground italic">
                        "Absolutely incredible experience! The guide was so knowledgeable and passionate. Highly recommend!"
                      </p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full rounded-xl">
                    Load More Reviews
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="sticky top-24 rounded-3xl border-border/50 shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary/80 dark:from-primary dark:to-primary/80 p-6 text-primary-foreground">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-4xl font-bold">${experience.price}</span>
                      <span className="text-sm opacity-80"> / person</span>
                    </div>
                    <Badge className="bg-white/20 hover:bg-white/30 border-none text-white">
                      <Zap className="h-3 w-3 mr-1" />
                      Best Value
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6 space-y-6">
                  <form onSubmit={handleBooking} className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Select Date
                      </Label>
                      <Input 
                        type="date" 
                        className="h-12 rounded-xl border-2 focus:border-primary/50 transition-all"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Number of Guests
                      </Label>
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-full"
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                          disabled={guests <= 1}
                        >
                          -
                        </Button>
                        <span className="text-xl font-semibold w-12 text-center">{guests}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-full"
                          onClick={() => setGuests(Math.min(experience.maxGuests, guests + 1))}
                          disabled={guests >= experience.maxGuests}
                        >
                          +
                        </Button>
                        <span className="text-sm text-muted-foreground">max {experience.maxGuests}</span>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="pt-4 space-y-3 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">${experience.price} × {guests} guests</span>
                        <span className="font-medium">${experience.price * guests}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Service fee</span>
                        <span className="font-medium text-emerald-500">FREE</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 text-xl font-bold border-t">
                        <span>Total</span>
                        <span className="text-primary">${totalPrice}</span>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-14 rounded-xl text-lg font-bold gap-2 shadow-xl shadow-primary/25 hover:scale-[1.02] transition-transform"
                      disabled={bookingMutation.isPending}
                    >
                      {bookingMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        <>
                          <Zap className="h-5 w-5" />
                          Reserve Now
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Guarantees */}
                  <div className="space-y-3 pt-4 text-xs text-muted-foreground border-t">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <span>WanderMind Guarantee - Secure & safe payment</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-blue-500" />
                      <span>Free cancellation up to 48 hours before start</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span>Best price guarantee - we'll match any price</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Dialog */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-6xl h-[85vh] rounded-3xl p-0 overflow-hidden border-none">
          <DialogTitle className="sr-only">Experience Gallery</DialogTitle>
          <div className="relative h-full bg-black">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={() => setIsGalleryOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={() => setSelectedImage((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            <img 
              src={allImages[selectedImage]} 
              alt="" 
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {allImages.slice(0, 8).map((_: string, idx: number) => (
                <button
                  key={idx}
                  className={`h-2 w-2 rounded-full transition-all ${idx === selectedImage ? 'bg-white w-4' : 'bg-white/50'}`}
                  onClick={() => setSelectedImage(idx)}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Skeleton Loader Component
function ExperienceDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <Skeleton className="h-[500px] w-full rounded-3xl" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-32 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-[500px] w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}