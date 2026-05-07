'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Star, Plus, ArrowRight, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export default function HostDashboard() {
  const { user } = useAuthStore();

  const { data: stats } = useQuery({
    queryKey: ['host-stats'],
    queryFn: async () => {
      // Assuming there's a host stats endpoint, or we calculate it
      // const res = await api.get('/host/stats');
      // return res.data;
      return {
        totalEarnings: 1240,
        activeExperiences: 3,
        totalBookings: 18,
        averageRating: 4.8
      };
    }
  });

  const displayStats = [
    { title: 'Total Earnings', value: `$${stats?.totalEarnings || 0}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Active Experiences', value: stats?.activeExperiences || 0, icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Total Bookings', value: stats?.totalBookings || 0, icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { title: 'Avg. Rating', value: stats?.averageRating || 0, icon: Star, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="space-y-8">
      <DashboardHeader 
        title={`Welcome, Host ${user?.name.split(' ')[0]}!`}
        description="Manage your experiences and track your earnings."
      >
        <Link href="/dashboard/host/experiences/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Experience
          </Button>
        </Link>
      </DashboardHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest bookings for your experiences.</CardDescription>
            </div>
            <Link href="/dashboard/host/bookings">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { guest: 'Alice Johnson', experience: 'Sunset Yacht Tour', date: 'Oct 12, 2023', amount: 150, status: 'Confirmed' },
                { guest: 'Bob Smith', experience: 'Traditional Cooking Class', date: 'Oct 15, 2023', amount: 85, status: 'Pending' },
                { guest: 'Charlie Brown', experience: 'Mountain Hiking Guide', date: 'Oct 20, 2023', amount: 120, status: 'Confirmed' },
              ].map((booking, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border bg-card/50">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {booking.guest.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{booking.guest}</p>
                      <p className="text-xs text-muted-foreground">{booking.experience} • {booking.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${booking.amount}</p>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                      booking.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Experiences Quick List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Experiences</CardTitle>
              <CardDescription>Your best performing activities.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: 'Sunset Yacht Tour', bookings: 45, rating: 4.9 },
              { title: 'Traditional Cooking', bookings: 32, rating: 4.8 },
              { title: 'Jungle Trekking', bookings: 28, rating: 4.7 },
            ].map((exp, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer">
                <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden">
                  <img src={`https://images.unsplash.com/photo-1544911845-1f34a3eb46b1?w=100&q=80`} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate group-hover:text-primary transition-colors">{exp.title}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {exp.bookings}</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {exp.rating}</span>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/dashboard/host/experiences">Manage All</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
