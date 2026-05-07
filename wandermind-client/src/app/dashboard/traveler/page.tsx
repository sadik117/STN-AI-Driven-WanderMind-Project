'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Heart, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TravelerDashboard() {
  const { user } = useAuthStore();

  const stats = [
    { title: 'Planned Trips', value: '12', icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Booked Experiences', value: '04', icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Saved Places', value: '28', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="space-y-8">
      <DashboardHeader 
        title={`Welcome back, ${user?.name.split(' ')[0]}!`}
        description="Here's what's happening with your travel plans."
      >
        <Link href="/ai-planner">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Plan New Trip
          </Button>
        </Link>
      </DashboardHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Itineraries */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Itineraries</CardTitle>
              <CardDescription>Your latest AI-generated travel plans.</CardDescription>
            </div>
            <Link href="/dashboard/traveler/itineraries">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer group">
                  <div className="h-12 w-12 rounded-md bg-muted flex-shrink-0 overflow-hidden">
                    <img 
                      src={`https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=100&q=80`} 
                      alt="Trip" 
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">Summer in Santorini</p>
                    <p className="text-xs text-muted-foreground">Created 2 days ago • 5 Days</p>
                  </div>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Bookings</CardTitle>
              <CardDescription>Manage your experience and tour bookings.</CardDescription>
            </div>
            <Link href="/dashboard/traveler/bookings">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-medium">No upcoming bookings</p>
              <p className="text-sm text-muted-foreground max-w-[250px] mt-1">
                Explore our curated experiences and start your next adventure.
              </p>
              <Link href="/experiences">
                <Button variant="outline" size="sm" className="mt-4">
                  Browse Experiences
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
