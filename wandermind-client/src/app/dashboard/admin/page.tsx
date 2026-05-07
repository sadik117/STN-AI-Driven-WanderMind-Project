'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MapPin, FileText, TrendingUp, UserPlus, FilePlus } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuthStore();

  const stats = [
    { title: 'Total Users', value: '1,284', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '+12%' },
    { title: 'Destinations', value: '156', icon: MapPin, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: '+5' },
    { title: 'Blog Posts', value: '42', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: '+3' },
    { title: 'Revenue', value: '$12,450', icon: TrendingUp, color: 'text-violet-500', bg: 'bg-violet-500/10', trend: '+18%' },
  ];

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Admin Control Center"
        description="Monitor system activity and manage platform content."
      >
      </DashboardHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  <p className="text-xs text-emerald-500 font-medium mt-1">{stat.trend} from last month</p>
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
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Platform Activity</CardTitle>
            <CardDescription>Latest actions performed by users and system.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { user: 'Sarah Jenkins', action: 'booked a new experience', time: '10 mins ago', item: 'Sunset Yacht Tour' },
                { user: 'Admin', action: 'published a blog post', time: '2 hours ago', item: 'Top 10 Hidden Gems in Asia' },
                { user: 'Mike Chen', action: 'joined the platform', time: '5 hours ago', item: 'New User' },
                { user: 'Host: Bali Retreats', action: 'added a new destination', time: '1 day ago', item: 'Ubud Jungle Villa' },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-semibold text-foreground">{activity.user}</span>{' '}
                      <span className="text-muted-foreground">{activity.action}</span>{' '}
                      <span className="font-medium text-primary">{activity.item}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 border-t rounded-none text-muted-foreground">
              View Activity Logs
            </Button>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Commonly used management tools.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/admin/users" className="block w-full">
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <Users className="h-5 w-5 text-blue-500" />
                Manage Users
              </Button>
            </Link>
            <Link href="/dashboard/admin/destinations" className="block w-full">
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <MapPin className="h-5 w-5 text-emerald-500" />
                Edit Destinations
              </Button>
            </Link>
            <Link href="/dashboard/admin/blogs" className="block w-full">
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <FileText className="h-5 w-5 text-amber-500" />
                Content Management
              </Button>
            </Link>
            <Link href="/dashboard/admin/settings" className="block w-full">
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <TrendingUp className="h-5 w-5 text-violet-500" />
                System Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
