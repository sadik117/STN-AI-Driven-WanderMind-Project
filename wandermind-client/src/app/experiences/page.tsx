'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  SlidersHorizontal, 
  Search, 
  ArrowRight,
  Heart,
  TrendingUp,
  Sparkles,
  Filter,
  X,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from 'framer-motion';

interface Experience {
  id: string;
  title: string;
  slug: string;
  location: string;
  images: string[];
  price: number;
  rating: number;
  reviewCount: number;
  duration: string;
  maxGuests: number;
  category: string;
  featured?: boolean;
}

const CATEGORIES = ['All', 'Adventure', 'Food', 'Cultural', 'Nature', 'Wellness', 'Luxury', 'Family'];

export default function ExperiencesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['experiences', search, selectedCategory, priceRange, sortBy],
    queryFn: async () => {
      const res = await api.get('/experiences', {
        params: { 
          search: search || undefined,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          sort: sortBy
        }
      });
      return res.data;
    },
  });

  const experiences = data || [];

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setPriceRange([0, 500]);
    setSortBy('rating');
  };

  const hasActiveFilters = search || selectedCategory !== 'All' || priceRange[0] > 0 || priceRange[1] < 500;

  return (
    <div className="pb-24">
      {/* Hero Section with Parallax */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-background">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-primary/10 text-primary border-none px-4 py-2 text-sm animate-pulse">
              <Sparkles className="h-3 w-3 mr-1" />
              Curated Experiences
            </Badge>
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Unforgettable <span className="text-primary italic">Moments</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              From local cooking classes to extreme adventures. Book unique activities led by expert hosts.
            </p>
            
            <div className="relative max-w-2xl mx-auto group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
              <Input 
                placeholder="Search experiences, tours, activities..." 
                className="pl-14 h-14 bg-background/80 backdrop-blur-sm shadow-xl border-2 border-border/50 rounded-2xl text-lg focus:border-primary/50 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button 
                size="sm" 
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl gap-2 shadow-lg"
              >
                Search
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
                className="rounded-full whitespace-nowrap transition-all hover:scale-105"
              >
                {cat === 'All' ? '✨ All' : cat}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-3">
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 rounded-xl">
                  <Filter className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && <Badge className="ml-1 bg-primary text-white">!</Badge>}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] rounded-l-3xl">
                <SheetHeader>
                  <SheetTitle className="text-2xl font-heading">Filter Experiences</SheetTitle>
                  <SheetDescription>
                    Narrow down your search to find the perfect experience.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex-1 py-6 space-y-8">
                  <div className="space-y-4">
                    <label className="font-semibold">Price Range (USD)</label>
                    <Slider
                      min={0}
                      max={500}
                      step={10}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="my-6"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}+</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="font-semibold">Sort By</label>
                    <div className="space-y-2">
                      {['rating', 'price_asc', 'price_desc', 'newest'].map((option) => (
                        <div key={option} className="flex items-center gap-2">
                          <Checkbox
                            id={option}
                            checked={sortBy === option}
                            onCheckedChange={() => setSortBy(option)}
                          />
                          <label htmlFor={option} className="text-sm capitalize cursor-pointer">
                            {option === 'rating' && '⭐ Top Rated'}
                            {option === 'price_asc' && '💰 Price: Low to High'}
                            {option === 'price_desc' && '💰 Price: High to Low'}
                            {option === 'newest' && '🆕 Newest First'}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <SheetFooter className="gap-2">
                  <Button variant="outline" onClick={clearFilters} className="w-full rounded-xl">
                    Clear All Filters
                  </Button>
                  <Button onClick={() => setShowFilters(false)} className="w-full rounded-xl">
                    Apply Filters
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="rating">⭐ Top Rated</option>
              <option value="price_asc">💰 Price: Low to High</option>
              <option value="price_desc">💰 Price: High to Low</option>
              <option value="newest">🆕 Newest First</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {search && (
              <Badge variant="secondary" className="gap-1">
                Search: {search}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSearch('')} />
              </Badge>
            )}
            {selectedCategory !== 'All' && (
              <Badge variant="secondary" className="gap-1">
                {selectedCategory}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory('All')} />
              </Badge>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 500) && (
              <Badge variant="secondary" className="gap-1">
                ${priceRange[0]} - ${priceRange[1]}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange([0, 500])} />
              </Badge>
            )}
          </div>
        )}

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
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
            <div className="col-span-full py-20 text-center">
              <div className="text-destructive">Failed to load experiences.</div>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : experiences && experiences.length > 0 ? (
            experiences.map((exp: Experience, idx: number) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Card className="group border-border/50 hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-2xl overflow-hidden rounded-3xl h-full flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={exp.images?.[0] || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop'} 
                      alt={exp.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-white/90 text-black border-none backdrop-blur-sm shadow-lg">
                        {exp.category}
                      </Badge>
                      {exp.featured && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none shadow-lg">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    {/* Wishlist Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/80 backdrop-blur-md hover:bg-white shadow-lg"
                    >
                      <Heart className="h-4 w-4 hover:fill-red-500 hover:text-red-500 transition-colors" />
                    </Button>
                    
                    {/* Rating Badge */}
                    <div className="absolute bottom-4 right-4 h-10 w-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-primary shadow-lg">
                      <Star className="h-5 w-5 fill-current" />
                    </div>
                  </div>
                  
                  <CardContent className="p-5 flex-1">
                    <div className="flex items-center gap-1 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                      <MapPin className="h-3 w-3" />
                      {exp.location}
                    </div>
                    <h3 className="font-heading font-bold text-xl mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {exp.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {exp.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        Max {exp.maxGuests}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        {exp.rating?.toFixed(1) || 'New'}
                      </span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-border/30 mt-2 pt-4">
                    <div className="flex items-baseline gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-2xl font-bold">{exp.price}</span>
                      <span className="text-sm text-muted-foreground">/ person</span>
                    </div>
                    <Link href={`/experiences/${exp.id}`}>
                      <Button 
                        size="sm" 
                        className="rounded-xl gap-2 font-bold group/btn hover:gap-3 transition-all"
                      >
                        Book Now
                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-gradient-to-br from-muted/20 to-muted/10 rounded-3xl">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">No experiences found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters.</p>
              <Button onClick={clearFilters} variant="outline" className="rounded-xl">
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Load More */}
        {experiences && experiences.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" className="rounded-xl gap-2">
              Load More Experiences
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}