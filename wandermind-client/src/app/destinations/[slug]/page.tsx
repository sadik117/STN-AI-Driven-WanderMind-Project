'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Share2, 
  Heart, 
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Calendar,
  CloudSun,
  Backpack
} from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DestinationReviews from '@/components/shared/DestinationReviews';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function DestinationDetailPage() {
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['destination', slug],
    queryFn: async () => {
      const res = await api.get(`/destinations/${slug}`);
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
          <Button className="rounded-xl">Back to Destinations</Button>
        </Link>
      </div>
    );
  }

  const destination = data;

  return (
    <div className="pb-24">
      {/* Hero Header */}
      <div className="relative h-[60vh] min-h-[500px] w-full">
        <img 
          src={destination.images[0] || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1031&auto=format&fit=crop'} 
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        {/* Top Navigation */}
        <div className="absolute top-8 left-0 w-full z-10">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <Link href="/destinations">
              <Button variant="outline" className="rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex gap-3">
              <Button 
                onClick={()=>{
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard!")}}
               size="icon" className="rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-primary text-primary-foreground border-none px-4 py-1 text-sm font-bold">
                  {destination.continent}
                </Badge>
                {destination.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur-md px-3 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 tracking-tight">
                {destination.name}
              </h1>
              <div className="flex flex-wrap items-center gap-8 text-white/90">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/20 p-2 rounded-full backdrop-blur-sm">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-lg font-medium">{destination.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-yellow-500/20 p-2 rounded-full backdrop-blur-sm">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  </div>
                  <span className="text-lg font-medium">{destination.rating} ({destination.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-500/20 p-2 rounded-full backdrop-blur-sm">
                    <DollarSign className="h-5 w-5 text-emerald-400" />
                  </div>
                  <span className="text-lg font-medium">${destination.avgCostPerDay} avg / day</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-14 bg-transparent gap-10 p-0 mb-10 overflow-x-auto no-scrollbar">
                  <TabsTrigger 
                    value="overview" 
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-14 px-0 text-lg font-bold transition-all"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="itineraries" 
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-14 px-0 text-lg font-bold transition-all"
                  >
                    AI Itineraries
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reviews" 
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-14 px-0 text-lg font-bold transition-all"
                  >
                    Reviews
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-0 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h2 className="text-3xl font-bold font-heading mb-6">About {destination.name}</h2>
                    <p className="text-muted-foreground leading-relaxed text-xl">
                      {destination.description || `Experience the breathtaking beauty of ${destination.name}. This unique destination offers a perfect blend of culture, adventure, and relaxation. From local traditions to modern amenities, there's something for everyone to discover.`}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                      <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-2xl">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-lg">Best Time to Visit</p>
                          <p className="text-muted-foreground">
                            {destination.bestMonths && destination.bestMonths.length > 0 
                              ? destination.bestMonths.join(', ') 
                              : 'Spring & Autumn'}
                          </p>
                        </div>
                      </div>
                      <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 flex items-start gap-4">
                        <div className="bg-blue-500/10 p-3 rounded-2xl">
                          <CloudSun className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-bold text-lg">Climate</p>
                          <p className="text-muted-foreground">{destination.climate || 'Mild and pleasant year-round'}</p>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold font-heading mt-12 mb-6">Top Highlights</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['Historical Landmarks', 'Local Gastronomy', 'Natural Wonders', 'Vibrant Nightlife'].map((highlight) => (
                        <div key={highlight} className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card hover:border-primary/30 transition-colors">
                          <div className="bg-emerald-500/10 p-1 rounded-full">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          </div>
                          <span className="font-semibold">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="itineraries" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-3xl p-12 border border-primary/10 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                      <Sparkles className="h-32 w-32 text-primary" />
                    </div>
                    <div className="h-20 w-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner shadow-white/20">
                      <Sparkles className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-3xl font-bold font-heading mb-4">AI-Powered Planning</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-10 text-lg">
                      Let our AI create a personalized, optimized itinerary for your trip to {destination.name} in seconds.
                    </p>
                    <Link href={`/ai-planner?destination=${destination.name}`}>
                      <Button className="h-14 px-10 rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 transition-all hover:scale-105">
                        Generate Personalized Plan
                      </Button>
                    </Link>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <DestinationReviews destinationId={destination.id} />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <Card className="rounded-[2.5rem] border-border/50 shadow-2xl overflow-hidden group">
                <CardHeader className="bg-muted/30 p-8">
                  <CardTitle className="text-2xl font-heading flex items-center gap-2">
                    <Backpack className="h-6 w-6 text-primary" />
                    Plan Your Journey
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20">
                      <span className="text-muted-foreground font-medium">Avg. Daily Cost</span>
                      <span className="font-bold text-xl text-primary">${destination.avgCostPerDay}</span>
                    </div>
                    <div className="flex items-center justify-between px-2">
                      <span className="text-muted-foreground font-medium">Accommodation</span>
                      <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5 font-bold px-3">Moderate</Badge>
                    </div>
                    <div className="flex items-center justify-between px-2">
                      <span className="text-muted-foreground font-medium">Accessibility</span>
                      <Badge variant="outline" className="text-blue-500 border-blue-500/20 bg-blue-500/5 font-bold px-3">Excellent</Badge>
                    </div>
                  </div>
                  
                  <div className="pt-8 border-t border-border/50 space-y-4">
                    <Link href={`/ai-planner?destination=${destination.name}`} className="w-full block">
                      <Button className="w-full h-14 rounded-2xl font-bold text-lg gap-3 group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 group-hover:opacity-90 transition-opacity" />
                        <Sparkles className="h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform" />
                        <span className="relative z-10">Plan with AI</span>
                      </Button>
                    </Link>
                    <Link href={`/experiences?destinationId=${destination.id}`} className="w-full block">
                      <Button variant="outline" className="w-full h-14 rounded-2xl font-bold text-lg group hover:border-primary transition-colors">
                        Find Experiences
                        <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Photos Grid */}
              <div className="space-y-4">
                <h4 className="font-bold text-xl px-2">Destination Gallery</h4>
                <div className="grid grid-cols-2 gap-4">
                  {destination.images.slice(0, 4).map((img: string, i: number) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square rounded-3xl overflow-hidden bg-muted group cursor-pointer shadow-lg"
                    >
                      <img 
                        src={img} 
                        alt={`View ${i + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-700" 
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
