'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Share2, 
  Heart, 
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DestinationDetailPage() {
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['destination', slug],
    queryFn: async () => {
      const res = await api.get(`/destinations/slug/${slug}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-[400px] w-full rounded-3xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
            <Skeleton className="h-[300px] w-full" />
          </div>
          <Skeleton className="h-[500px] w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Destination Not Found</h2>
        <p className="text-muted-foreground mb-8">We couldn't find the destination you're looking for.</p>
        <Link href="/destinations">
          <Button>Back to Destinations</Button>
        </Link>
      </div>
    );
  }

  const destination = data;

  return (
    <div className="pb-24">
      {/* Hero Header */}
      <div className="relative h-[60vh] min-h-[450px] w-full">
        <img 
          src={destination.images[0] || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1031&auto=format&fit=crop'} 
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="bg-primary text-primary-foreground border-none px-3 py-1">
                {destination.continent}
              </Badge>
              {destination.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur-md px-3 py-1">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4 tracking-tight">
              {destination.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-lg font-medium">{destination.country}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent fill-accent" />
                <span className="text-lg font-medium">{destination.rating} (128 reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-400" />
                <span className="text-lg font-medium">${destination.avgCostPerDay} avg / day</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Actions */}
        <div className="absolute top-8 right-8 flex gap-3">
          <Button variant="outline" size="icon" className="rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20">
            <Share2 className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20">
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent gap-8 p-0 mb-8">
                  <TabsTrigger 
                    value="overview" 
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-0 text-base font-semibold"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="itineraries" 
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-0 text-base font-semibold"
                  >
                    AI Itineraries
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reviews" 
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-0 text-base font-semibold"
                  >
                    Reviews
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-0">
                  <div className="prose prose-lg max-w-none">
                    <h2 className="text-2xl font-bold font-heading mb-4">About {destination.name}</h2>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {destination.description || `Experience the breathtaking beauty of ${destination.name}. This unique destination offers a perfect blend of culture, adventure, and relaxation. From local traditions to modern amenities, there's something for everyone to discover.`}
                    </p>
                    
                    <h3 className="text-xl font-bold font-heading mt-8 mb-4">Best Time to Visit</h3>
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl border">
                      <Clock className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-semibold">Spring & Autumn</p>
                        <p className="text-sm text-muted-foreground">Ideal weather for exploration and sightseeing.</p>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold font-heading mt-8 mb-4">Top Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['Historical Landmarks', 'Local Gastronomy', 'Natural Wonders', 'Vibrant Nightlife'].map((highlight) => (
                        <div key={highlight} className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          <span className="font-medium">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="itineraries">
                  <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 text-center">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold font-heading mb-3">AI-Powered Planning</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8">
                      Let our AI create a personalized 5-day itinerary for your trip to {destination.name} based on your interests.
                    </p>
                    <Link href={`/ai-planner?destination=${destination.name}`}>
                      <Button className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/25">
                        Generate Itinerary
                      </Button>
                    </Link>
                  </div>
                </TabsContent>

                <TabsContent value="reviews">
                  <div className="py-8 text-center text-muted-foreground">
                    Reviews section coming soon.
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="rounded-3xl border-border/50 shadow-xl overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                  <CardTitle className="text-xl">Plan Your Trip</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Avg. Daily Cost</span>
                      <span className="font-bold text-lg">${destination.avgCostPerDay}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Accommodation</span>
                      <span className="text-emerald-500 font-medium">Moderate</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Accessibility</span>
                      <span className="text-blue-500 font-medium">Good</span>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t space-y-3">
                    <Link href={`/ai-planner?destination=${destination.name}`} className="w-full">
                      <Button className="w-full h-12 rounded-xl font-bold gap-2 group">
                        Plan with AI
                        <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full h-12 rounded-xl font-bold">
                      Find Experiences
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Photos Grid */}
              <div className="grid grid-cols-2 gap-3">
                {destination.images.slice(0, 4).map((img: string, i: number) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-muted group cursor-pointer">
                    <img 
                      src={img} 
                      alt={`View ${i + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Card components if not available globally
function Card({ children, className, ...props }: any) {
  return <div className={`bg-card rounded-xl border ${className}`} {...props}>{children}</div>;
}
function CardHeader({ children, className, ...props }: any) {
  return <div className={`p-6 pb-0 ${className}`} {...props}>{children}</div>;
}
function CardTitle({ children, className, ...props }: any) {
  return <h3 className={`font-bold tracking-tight ${className}`} {...props}>{children}</h3>;
}
function CardContent({ children, className, ...props }: any) {
  return <div className={`p-6 ${className}`} {...props}>{children}</div>;
}
