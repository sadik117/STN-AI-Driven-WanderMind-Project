'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  MapPin, 
  FileText, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Package,
  ShoppingBag,
  Loader2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { useState, useEffect } from 'react';

interface AdminStats {
  stats: {
    totalUsers: number;
    totalDestinations: number;
    totalExperiences: number;
    totalBookings: number;
    totalRevenue: number;
  };
  recentBookings: Array<{
    id: string;
    createdAt: string;
    totalPrice: number;
    status: string;
    user: { name: string };
    experience: { title: string };
  }>;
  usersByRole: Array<{
    role: string;
    _count: { role: number };
  }>;
  monthlyData: Array<{
    month: string;
    bookings: number;
    revenue: number;
  }>;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ef4444', '#10b981', '#f59e0b'];

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: statsData, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      console.log('Admin Stats Response:', res.data);
      return res.data;
    },
    refetchInterval: 30000,
    retry: 2,
  });

  const data: AdminStats = statsData;

  // Prepare chart data for users by role
  const roleChartData = data?.usersByRole?.map(item => ({
    name: item.role,
    value: item._count.role,
    label: item.role.charAt(0) + item.role.slice(1).toLowerCase()
  })) || [];

  // Use real monthly data from backend or create empty array
  const monthlyData = data?.monthlyData || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-emerald-500/10 text-emerald-500';
      case 'PENDING': return 'bg-amber-500/10 text-amber-500';
      case 'CANCELLED': return 'bg-red-500/10 text-red-500';
      case 'COMPLETED': return 'bg-blue-500/10 text-blue-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatNumber = (num: number) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const stats = [
    { 
      title: 'Total Users', 
      value: formatNumber(data?.stats?.totalUsers || 0), 
      icon: Users, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10',
    },
    { 
      title: 'Destinations', 
      value: formatNumber(data?.stats?.totalDestinations || 0), 
      icon: MapPin, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10',
    },
    { 
      title: 'Experiences', 
      value: formatNumber(data?.stats?.totalExperiences || 0), 
      icon: Package, 
      color: 'text-purple-500', 
      bg: 'bg-purple-500/10',
    },
    { 
      title: 'Total Bookings', 
      value: formatNumber(data?.stats?.totalBookings || 0), 
      icon: ShoppingBag, 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10',
    },
    { 
      title: 'Total Revenue', 
      value: formatCurrency(data?.stats?.totalRevenue || 0), 
      icon: DollarSign, 
      color: 'text-violet-500', 
      bg: 'bg-violet-500/10',
    },
  ];

  if (error) {
    return (
      <div className="space-y-8">
        <DashboardHeader
          title="Admin Control Center"
          description="Monitor system activity and manage platform content."
        />
        <Card className="rounded-3xl">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load Dashboard</h3>
            <p className="text-muted-foreground mb-4">
              There was an error loading the admin statistics. Please try again.
            </p>
            <Button onClick={() => refetch()} className="rounded-xl">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Admin Control Center"
        description="Monitor system activity and manage platform content."
      >
        <Button 
          variant="outline" 
          className="gap-2 rounded-xl"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </DashboardHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-all duration-300 overflow-hidden group">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">{stat.title}</p>
                    <h3 className="text-xl md:text-2xl font-bold mt-1 truncate">{stat.value}</h3>
                  </div>
                  <div className={`${stat.bg} ${stat.color} p-2 md:p-3 rounded-xl flex-shrink-0 ml-2 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Revenue & Bookings Chart */}
        <Card className="rounded-3xl overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-lg md:text-xl">Revenue Overview</CardTitle>
                <CardDescription>Monthly booking revenue and volume trends</CardDescription>
              </div>
              {monthlyData.length > 0 && (
                <div className="flex gap-1">
                  <Button
                    variant={chartType === 'bar' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('bar')}
                    className="rounded-lg text-xs md:text-sm h-8 md:h-9"
                  >
                    Bar
                  </Button>
                  <Button
                    variant={chartType === 'line' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('line')}
                    className="rounded-lg text-xs md:text-sm h-8 md:h-9"
                  >
                    Line
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] md:h-[350px] w-full">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : monthlyData.length > 0 && isClient ? (
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'bar' ? (
                    <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis yAxisId="left" className="text-xs" />
                      <YAxis yAxisId="right" orientation="right" className="text-xs" />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(value: any, name: any) => {
                          if (name === 'revenue') return [formatCurrency(value), 'Revenue'];
                          return [value, 'Bookings'];
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="bookings" name="Bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="revenue" name="Revenue ($)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No data available for {new Date().getFullYear()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Role Distribution Pie Chart */}
        <Card className="rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">User Distribution</CardTitle>
            <CardDescription>Breakdown of users by role</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] md:h-[350px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : roleChartData.length > 0 && isClient ? (
              <>
                <div className="h-[300px] md:h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={roleChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {roleChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(value: any, name: any) => [value, `${name} Users`]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Role Summary Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-4 border-t">
                  {roleChartData.map((role, idx) => (
                    <div key={role.name} className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-xs text-muted-foreground">{role.label}:</span>
                      </div>
                      <p className="text-lg font-bold">{role.value}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[300px] md:h-[350px] flex items-center justify-center">
                <p className="text-muted-foreground">No user data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2 rounded-3xl">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-lg md:text-xl">Recent Bookings</CardTitle>
                <CardDescription>Latest customer bookings on the platform</CardDescription>
              </div>
              <Link href="/dashboard/admin/bookings">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View All
                  <TrendingUp className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(4).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : data?.recentBookings && data.recentBookings.length > 0 ? (
              <div className="space-y-4">
                {data.recentBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-xl hover:bg-muted/20 transition-colors">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{booking.user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{booking.experience.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 ml-11 sm:ml-0">
                      <p className="text-sm font-semibold">${booking.totalPrice}</p>
                      <Badge className={`${getStatusColor(booking.status)} rounded-full px-2 py-0.5 text-xs`}>
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                <p className="text-muted-foreground">No recent bookings</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
            <CardDescription>Commonly used management tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/admin/users" className="block w-full">
              <Button variant="outline" className="w-full justify-start gap-3 h-11 md:h-12 text-sm">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-blue-500 flex-shrink-0" />
                <span className="truncate">Manage Users</span>
              </Button>
            </Link>
            <Link href="/dashboard/admin/destinations" className="block w-full">
              <Button variant="outline" className="w-full justify-start gap-3 h-11 md:h-12 text-sm">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 text-emerald-500 flex-shrink-0" />
                <span className="truncate">Edit Destinations</span>
              </Button>
            </Link>
            <Link href="/dashboard/admin/blogs" className="block w-full">
              <Button variant="outline" className="w-full justify-start gap-3 h-11 md:h-12 text-sm">
                <FileText className="h-4 w-4 md:h-5 md:w-5 text-amber-500 flex-shrink-0" />
                <span className="truncate">Blog Management</span>
              </Button>
            </Link>
            <Link href="/dashboard/admin/all-bookings" className="block w-full">
              <Button variant="outline" className="w-full justify-start gap-3 h-11 md:h-12 text-sm">
                <ShoppingBag className="h-4 w-4 md:h-5 md:w-5 text-purple-500 flex-shrink-0" />
                <span className="truncate">Booking Management</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Footer */}
      {!isLoading && data && (
        <Card className="rounded-3xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-none">
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
              <div>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {data?.stats?.totalBookings || 0}
                </p>
                <p className="text-xs text-muted-foreground">Total Bookings</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {data?.usersByRole?.find(r => r.role === 'TRAVELER')?._count.role || 0}
                </p>
                <p className="text-xs text-muted-foreground">Travelers</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {data?.usersByRole?.find(r => r.role === 'HOST')?._count.role || 0}
                </p>
                <p className="text-xs text-muted-foreground">Hosts</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {data?.usersByRole?.find(r => r.role === 'ADMIN')?._count.role || 0}
                </p>
                <p className="text-xs text-muted-foreground">Admins</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {data?.stats?.totalExperiences || 0}
                </p>
                <p className="text-xs text-muted-foreground">Experiences</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {data?.stats?.totalDestinations || 0}
                </p>
                <p className="text-xs text-muted-foreground">Destinations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}