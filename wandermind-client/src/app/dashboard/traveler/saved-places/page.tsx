'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, MapPin, Star, Trash2, Compass, TrendingUp,
    AlertCircle, Eye, Share2, Sparkles, Loader2,
    Grid3x3, List, Search, Globe, DollarSign,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';

// Types 
interface Experience {
    id: string;
    title: string;
    price: number;
    rating: number;
    images: string[];
    category: string;
}

interface Destination {
    id: string;
    name: string;
    slug: string;
    country: string;
    continent: string;
    description: string;
    images: string[];
    avgCostPerDay: number;
    rating: number;
    reviewCount: number;
    tags: string[];
    createdAt: string;
    experiences: Experience[];
    _count?: { experiences: number };
}

interface WishlistStats {
    totalDestinations: number;
    avgRating: number;
    totalExperiences: number;
    continents: string[];
}

interface WishlistData {
    wishlist: Destination[];
    stats: WishlistStats;
}

// Constants 
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80';

const CONTINENT_COLORS: Record<string, string> = {
    Europe: 'bg-blue-500/10 text-blue-600 border-blue-200',
    Asia: 'bg-rose-500/10 text-rose-600 border-rose-200',
    Africa: 'bg-amber-500/10 text-amber-600 border-amber-200',
    'South America': 'bg-green-500/10 text-green-600 border-green-200',
    'North America': 'bg-violet-500/10 text-violet-600 border-violet-200',
    Oceania: 'bg-cyan-500/10 text-cyan-600 border-cyan-200',
};

// Helpers 
const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });


// Stat Card 
function StatCard({
    label,
    value,
    sub,
    icon: Icon,
    color,
    delay,
}: {
    label: string;
    value: string | number;
    sub?: string;
    icon: React.ElementType;
    color: string;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4, ease: 'easeOut' }}
        >
            <Card className={`rounded-2xl border ${color} overflow-hidden relative`}>
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">{label}</p>
                            <h3 className="text-3xl font-bold mt-1 tracking-tight">{value}</h3>
                            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
                        </div>
                        <div className="h-11 w-11 rounded-xl bg-background/60 backdrop-blur flex items-center justify-center shadow-sm">
                            <Icon className="h-5 w-5" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}


// List Card 
function ListCard({
    destination,
    index,
    onRemove,
}: {
    destination: Destination;
    index: number;
    onRemove: (d: Destination) => void;
}) {
    const continentClass = CONTINENT_COLORS[destination.continent] ?? 'bg-muted text-muted-foreground border-border';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
        >
            <Card className="group overflow-hidden rounded-2xl border border-border/50 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/8 transition-all duration-400 bg-card flex flex-col sm:flex-row">
                {/* Image */}
                <div className="relative w-full sm:w-56 h-44 sm:h-auto flex-shrink-0 overflow-hidden bg-muted">
                    <img
                        src={destination.images?.[0] || FALLBACK_IMAGE}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                    <Badge className={`absolute top-3 left-3 text-xs border ${continentClass} backdrop-blur-sm`}>
                        {destination.continent}
                    </Badge>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                                {destination.name}
                            </h3>
                            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {destination.country}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                    {(destination.rating ?? 0).toFixed(1)}
                                    <span className="text-xs">({(destination.reviewCount ?? 0).toLocaleString()})</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">per day</p>
                                <p className="text-lg font-bold text-primary">{formatCurrency(destination.avgCostPerDay)}</p>
                            </div>
                            <button
                                onClick={() => onRemove(destination)}
                                className="h-9 w-9 rounded-xl border border-border/50 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all group/del"
                            >
                                <Trash2 className="h-4 w-4 group-hover/del:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <p className="text-muted-foreground text-sm line-clamp-2 mt-3 leading-relaxed">
                        {destination.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-3 gap-3 flex-wrap">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                            {destination.tags?.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="text-xs bg-muted/60 px-2.5 py-0.5 rounded-full text-muted-foreground border border-border/50"
                                >
                                    {tag}
                                </span>
                            ))}
                            {(destination._count?.experiences ?? 0) > 0 && (
                                <span className="text-xs bg-emerald-500/10 text-emerald-600 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                    {destination._count!.experiences} experiences
                                </span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0">
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl h-8 px-3 gap-1 text-xs"
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        `${window.location.origin}/destinations/${destination.slug}`
                                    );
                                    toast.success('Link copied!');
                                }}
                            >
                                <Share2 className="h-3 w-3" />
                                Share
                            </Button>
                            <Link href={`/destinations/${destination.slug}`}>
                                <Button size="sm" className="rounded-xl h-8 px-3 gap-1 text-xs">
                                    <Eye className="h-3 w-3" />
                                    Explore
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

// Loading Skeletons 
function GridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-3xl overflow-hidden border border-border/30">
                    <Skeleton className="h-52 w-full rounded-none" />
                    <div className="p-5 space-y-3">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-5/6" />
                        <div className="flex gap-2 pt-2">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Main Page 

export default function TravelerWishlist() {
    const queryClient = useQueryClient();
    const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'rating' | 'price' | 'name'>('rating');
    const [continentFilter, setContinentFilter] = useState<string>('all');


    // Data fetching 
    const { data: wishlistData, isLoading, error, refetch } = useQuery<WishlistData>({
        queryKey: ['wishlist'],
        queryFn: async () => {
            const res = await api.get('/destinations/my-wishlist');
            // sendSuccess wraps as { success, message, data } — but guard both shapes
            const payload = res.data?.data ?? res.data;
            if (!payload) throw new Error('Empty response from wishlist API');
            return {
                wishlist: payload.wishlist ?? [],
                stats: payload.stats ?? {
                    totalDestinations: 0,
                    avgRating: 0,
                    totalExperiences: 0,
                    continents: [],
                },
            } satisfies WishlistData;
        },
    });

    const removeFromWishlistMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await api.post(`/destinations/${id}/wishlist`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            toast.success(`"${selectedDestination?.name}" removed from wishlist`);
            setIsDeleteOpen(false);
            setSelectedDestination(null);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to remove from wishlist');
        },
    });

    // Derived data 

    const wishlist = wishlistData?.wishlist ?? [];
    const stats = wishlistData?.stats ?? {
        totalDestinations: 0,
        avgRating: 0,
        totalExperiences: 0,
        continents: [],
    };

    const availableContinents = useMemo(
        () => [...new Set(wishlist.map((d) => d.continent))].sort(),
        [wishlist]
    );

    const filteredWishlist = useMemo(() => {
        return wishlist
            .filter((dest) => {
                const s = searchTerm.toLowerCase();
                const matchesSearch =
                    !s ||
                    dest.name?.toLowerCase().includes(s) ||
                    dest.country?.toLowerCase().includes(s) ||
                    dest.continent?.toLowerCase().includes(s) ||
                    dest.tags?.some((t) => t.toLowerCase().includes(s));
                const matchesContinent =
                    continentFilter === 'all' || dest.continent === continentFilter;
                return matchesSearch && matchesContinent;
            })
            .sort((a, b) => {
                if (sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
                if (sortBy === 'price') return (a.avgCostPerDay ?? 0) - (b.avgCostPerDay ?? 0);
                return a.name.localeCompare(b.name);
            });
    }, [wishlist, searchTerm, sortBy, continentFilter]);

    // Handlers 
    const handleRemove = (destination: Destination) => {
        setSelectedDestination(destination);
        setIsDeleteOpen(true);
    };

    // Render: Error
    if (error) {
        return (
            <div className="space-y-8">
                <DashboardHeader
                    title="My Wishlist"
                    description="Your saved destinations and travel inspirations."
                />
                <Card className="rounded-3xl">
                    <CardContent className="p-16 text-center">
                        <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="h-8 w-8 text-red-500" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Failed to load wishlist</h3>
                        <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                            There was an error fetching your saved places. Please try again.
                        </p>
                        <Button onClick={() => refetch()} className="rounded-xl">
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Render: Main 
    return (
        <div className="space-y-8">
            {/* Header */}
            <DashboardHeader
                title="My Wishlist"
                description="Your saved destinations and travel inspirations."
            >
                <div className="flex gap-2">
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="rounded-xl gap-1.5"
                    >
                        <List className="h-4 w-4" />
                        <span className="hidden sm:inline">List</span>
                    </Button>
                </div>
            </DashboardHeader>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Saved Places"
                    value={stats.totalDestinations}
                    icon={Heart}
                    color="bg-gradient-to-br from-rose-500/8 to-transparent border-rose-500/15"
                    delay={0}
                />
                <StatCard
                    label="Average Rating"
                    value={`${(stats.avgRating ?? 0).toFixed(1)} ★`}
                    icon={Star}
                    color="bg-gradient-to-br from-amber-500/8 to-transparent border-amber-500/15"
                    delay={0.07}
                />
                <StatCard
                    label="Experience"
                    value={stats.totalExperiences}
                    sub="across all places"
                    icon={Sparkles}
                    color="bg-gradient-to-br from-emerald-500/8 to-transparent border-emerald-500/15"
                    delay={0.14}
                />
                <StatCard
                    label="Continents"
                    value={stats.continents?.length ?? 0}
                    sub={stats.continents?.slice(0, 2).join(', ') || 'None yet'}
                    icon={Globe}
                    color="bg-gradient-to-br from-violet-500/8 to-transparent border-violet-500/15"
                    delay={0.21}
                />
            </div>

            {/* Filters */}
            {(wishlist.length > 0 || isLoading) && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
                >
                    {/* Search */}
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                            placeholder="Search places, countries, tags…"
                            className="pl-10 rounded-xl bg-background"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3">
                        {/* Continent filter */}
                        {availableContinents.length > 1 && (
                            <Select value={continentFilter} onValueChange={setContinentFilter}>
                                <SelectTrigger className="w-[160px] rounded-xl">
                                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder="Continent" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Continents</SelectItem>
                                    {availableContinents.map((c) => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        {/* Sort */}
                        <Select
                            value={sortBy}
                            onValueChange={(v: 'rating' | 'price' | 'name') => setSortBy(v)}
                        >
                            <SelectTrigger className="w-[160px] rounded-xl">
                                <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="rating">⭐ Top Rated</SelectItem>
                                <SelectItem value="price">💰 Lowest Cost</SelectItem>
                                <SelectItem value="name">🔤 Name A–Z</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </motion.div>
            )}

            {/* Cards */}
            {isLoading ? (
                <GridSkeleton />
            ) : filteredWishlist.length > 0 ? (
                <AnimatePresence mode="popLayout">

                    {filteredWishlist.map((destination, index) => (
                        <ListCard
                            key={destination.id}
                            destination={destination}
                            index={index}
                            onRemove={handleRemove}
                        />
                    ))}
                </AnimatePresence>

            ) : searchTerm || continentFilter !== 'all' ? (
                /* No search results */
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Card className="rounded-3xl border-dashed">
                        <CardContent className="p-16 text-center">
                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                                <Search className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No matching places</h3>
                            <p className="text-muted-foreground text-sm mb-6">
                                Try different keywords or clear your filters.
                            </p>
                            <div className="flex gap-3 justify-center">
                                {searchTerm && (
                                    <Button variant="outline" className="rounded-xl" onClick={() => setSearchTerm('')}>
                                        Clear Search
                                    </Button>
                                )}
                                {continentFilter !== 'all' && (
                                    <Button variant="outline" className="rounded-xl" onClick={() => setContinentFilter('all')}>
                                        All Continents
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ) : (
                /* Empty state */
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="rounded-3xl border-dashed">
                        <CardContent className="p-16 text-center">
                            <div className="relative h-20 w-20 mx-auto mb-6">
                                <div className="h-20 w-20 rounded-full bg-primary/8 flex items-center justify-center">
                                    <Heart className="h-9 w-9 text-primary/40" />
                                </div>
                                <div className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center">
                                    <Compass className="h-3.5 w-3.5 text-primary" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
                            <p className="text-muted-foreground text-sm mb-8 max-w-xs mx-auto leading-relaxed">
                                Start saving destinations you love — they'll all appear here so you can plan your next trip.
                            </p>
                            <Link href="/destinations">
                                <Button className="rounded-xl gap-2 px-6">
                                    <Compass className="h-4 w-4" />
                                    Explore Destinations
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Budget summary (only when items exist) */}
            {wishlist.length > 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="rounded-3xl border-primary/20 bg-gradient-to-r from-primary/5 via-primary/8 to-transparent">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <DollarSign className="h-5 w-5 text-primary" />
                                Budget Overview
                            </CardTitle>
                            <CardDescription>Daily cost range across your saved destinations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-6">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-0.5">Cheapest</p>
                                    <p className="text-2xl font-bold text-emerald-600">
                                        {formatCurrency(Math.min(...wishlist.map((d) => d.avgCostPerDay)))}/day
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-0.5">Most Expensive</p>
                                    <p className="text-2xl font-bold text-rose-600">
                                        {formatCurrency(Math.max(...wishlist.map((d) => d.avgCostPerDay)))}/day
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-0.5">Average</p>
                                    <p className="text-2xl font-bold text-primary">
                                        {formatCurrency(
                                            Math.round(wishlist.reduce((a, d) => a + d.avgCostPerDay, 0) / wishlist.length)
                                        )}/day
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Confirm remove dialog */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent className="rounded-3xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove from wishlist?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Remove <strong>"{selectedDestination?.name}"</strong> from your saved places?
                            You can always add it back later.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() =>
                                selectedDestination &&
                                removeFromWishlistMutation.mutate(selectedDestination.id)
                            }
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl gap-2"
                            disabled={removeFromWishlistMutation.isPending}
                        >
                            {removeFromWishlistMutation.isPending && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                            Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}