'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { travelerStatsQuery, TravelerStats } from '@/services/stats.service';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MapPin,
  Calendar,
  Star,
  Compass,
  Heart,
  BookOpen,
  Backpack,
  Clock,
  TrendingUp,
  Map as MapIcon,
  ChevronRight,
  Plane,
  Briefcase,
  History,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { myBookingsQuery, Booking } from '@/services/booking.service';
import { myPackingListsQuery, PackingList } from '@/services/user.service';
import { format } from 'date-fns';

export default function TravelerDashboard() {
  const { data: stats, isLoading: isStatsLoading, isError: isStatsError, refetch } = useQuery<TravelerStats>(travelerStatsQuery);
  const { data: bookingsData, isLoading: isBookingsLoading, isError: isBookingsError } = useQuery(myBookingsQuery({ limit: 5 }));
  const { data: packingLists, isLoading: isPackingLoading, isError: isPackingError } = useQuery(myPackingListsQuery);

  const bookings = (Array.isArray(bookingsData) ? bookingsData : bookingsData?.data) || [] as Booking[];
  const isLoading = isStatsLoading || isBookingsLoading || isPackingLoading;
  const hasError = isStatsError || isBookingsError || isPackingError;


  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const statCards = [
    {
      title: 'Trips Booked',
      value: stats?.totalBookings || 0,
      icon: Plane,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      description: `${stats?.confirmedBookings || 0} confirmed, ${stats?.pendingBookings || 0} pending`,
    },
    {
      title: 'Saved Places',
      value: stats?.wishlist.count || 0,
      icon: Heart,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
      description: `Across ${stats?.wishlist.continents.length || 0} continents`,
    },
    {
      title: 'Itineraries',
      value: stats?.itineraries || 0,
      icon: MapIcon,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      description: 'AI-generated plans',
    },
    {
      title: 'Travel Journal',
      value: stats?.journalEntries || 0,
      icon: BookOpen,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      description: 'Recorded memories',
    },
  ];

  const secondaryStats = [
    {
      title: 'Total Spent',
      value: `$${(stats?.totalSpent || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-emerald-500',
    },
    {
      title: 'Continents Visited',
      value: stats?.continentsVisited.length || 0,
      icon: Compass,
      color: 'text-blue-500',
    },
    {
      title: 'Reviews Written',
      value: stats?.reviews || 0,
      icon: Star,
      color: 'text-amber-500',
    },
  ];

  if (hasError) {

    return (
      <div className="space-y-8">
        <DashboardHeader
          title="My Travel Dashboard"
          description="Track your journeys and plan your next adventure"
        />
        <Card className="rounded-3xl">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold mb-2">Failed to Load Dashboard</h3>
            <p className="text-muted-foreground mb-4">
              There was an error loading your travel data. Please try again.
            </p>
            <Button onClick={() => refetch()} className="rounded-xl">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <DashboardHeader
        title="My Travel Dashboard"
        description="Track your journeys and plan your next adventure"
      >
        <Link href="/destinations">
          <Button className="gap-2 rounded-xl">
            <Compass className="h-4 w-4" />
            Explore Destinations
          </Button>
        </Link>
      </DashboardHeader>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))
        ) : (
          statCards.map((stat) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card className="rounded-2xl hover:shadow-lg transition-all duration-300 border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                    </div>
                    <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Secondary Stats Row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))
        ) : (
          secondaryStats.map((stat) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card className="rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} bg-${stat.color.split('-')[1]}/10 p-2 rounded-xl`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Trips */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-3xl overflow-hidden border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Upcoming & Recent Trips
                </CardTitle>
                <CardDescription>Your latest travel bookings</CardDescription>
              </div>
              <Link href="/dashboard/traveler/bookings">
                <Button variant="ghost" size="sm" className="gap-1 rounded-lg">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isBookingsLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-2xl" />
                  ))
                ) : bookings.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-3">🏖️</div>
                    <p className="text-muted-foreground">No bookings found. Start exploring!</p>
                  </div>
                ) : (
                  bookings.map((booking: Booking) => (
                    <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-border/40 hover:border-primary/30 transition-colors bg-card/50 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Plane className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-base line-clamp-1">{booking.experience.title}</h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {booking.experience.destination.name} • {format(new Date(booking.date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right sm:text-right">
                          <p className="font-bold text-emerald-600">${booking.totalPrice.toLocaleString()}</p>
                          <Badge 
                            variant="outline" 
                            className={`text-[10px] uppercase font-bold ${
                              booking.status === 'CONFIRMED' ? 'text-emerald-600 border-emerald-600/20 bg-emerald-600/5' :
                              booking.status === 'PENDING' ? 'text-amber-600 border-amber-600/20 bg-amber-600/5' :
                              booking.status === 'COMPLETED' ? 'text-blue-600 border-blue-600/20 bg-blue-600/5' :
                              'text-rose-600 border-rose-600/20 bg-rose-600/5'
                            }`}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6 w-full">

          {/* Travel Tools */}
          <div>
            {/* Packing Lists */}
            <Card className="rounded-2xl sm:rounded-3xl border-border/50 bg-gradient-to-br from-blue-500/5 to-transparent">
              <CardHeader className="space-y-1">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Backpack className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                  Packing Lists
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Stay organized for your next trip
                </CardDescription>
              </CardHeader>

              <CardContent>
                {isPackingLoading ? (
                  <Skeleton className="h-12 rounded-xl" />
                ) : packingLists && packingLists.length > 0 ? (
                  <div className="space-y-3">
                    {packingLists.slice(0, 2).map((list: PackingList) => (
                      <div key={list.id} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/40">
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium line-clamp-1">{list.destination}</span>
                            <span className="text-[10px] text-muted-foreground">{list.tripType}</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="rounded-full text-[10px]">
                          {list.itemsJson?.length || 0} items
                        </Badge>
                      </div>
                    ))}

                  </div>
                ) : (
                  <div className="text-center py-4 border border-dashed rounded-xl border-border/50">
                    <p className="text-xs text-muted-foreground">No packing lists created</p>
                  </div>
                )}
                <Link href="/dashboard/traveler/packing-lists">
                  <Button variant="outline" className="w-full mt-4 rounded-xl">
                    Manage Lists
                  </Button>
                </Link>
              </CardContent>

            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
