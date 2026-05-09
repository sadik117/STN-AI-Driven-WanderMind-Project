'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { hostStatsQuery, HostStats } from '@/services/stats.service';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  MapPin, 
  Package, 
  Calendar, 
  Star, 
  DollarSign, 
  TrendingUp, 
  PieChart as PieChartIcon,
  ArrowUpRight,
  MessageCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Line
} from 'recharts';

const COLORS = ['#f59e0b', '#8b5cf6', '#ef4444', '#10b981', '#3b82f6'];

export default function HostDashboard() {
  const { data: stats, isLoading, isError, refetch } = useQuery<HostStats>(hostStatsQuery);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  const monthlyBookingsData = stats?.revenue?.monthly || [];
  
  const categoryDistribution = stats?.experiences?.categories?.map((cat, index) => ({
    name: cat,
    value: 1, // backend only returns distinct categories, so we'll weight them equally
    color: COLORS[index % COLORS.length]
  })) || [];

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
      title: 'Total Experiences',
      value: stats?.experiences?.total || 0,
      icon: Package,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      title: 'Total Bookings',
      value: stats?.bookings?.total || 0,
      icon: Calendar,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Total Earnings',
      value: `$${(stats?.revenue?.total || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Avg Rating',
      value: stats?.reviews?.avgRating?.toFixed(1) || '0.0',
      icon: Star,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      suffix: '★',
    },
  ];

  const secondaryStats = [
    {
      title: 'Total Guests Hosted',
      value: stats?.guests?.total || 0,
      icon: MapPin,
      color: 'text-cyan-500',
    },
    {
      title: 'Featured Experiences',
      value: stats?.experiences?.featured || 0,
      icon: TrendingUp,
      color: 'text-indigo-500',
    },
    {
      title: 'Reviews Received',
      value: stats?.reviews?.total || 0,
      icon: MessageCircle,
      color: 'text-pink-500',
    },
  ];

  if (isError) {
    return (
      <div className="space-y-8">
        <DashboardHeader 
          title="Host Dashboard" 
          description="Manage your experiences and track your performance"
        />
        <Card className="rounded-3xl">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Failed to Load Dashboard</h3>
            <p className="text-muted-foreground mb-4">
              There was an error loading your dashboard data. Please try again.
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
        title="Host Dashboard" 
        description="Manage your experiences and track your performance"
      >
        <Link href="/dashboard/host/experiences">
          <Button className="gap-2 rounded-xl">
            <Package className="h-4 w-4" />
            Manage Experiences
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
                      <div className="flex items-baseline gap-1 mt-2">
                        <h3 className="text-3xl font-bold">{stat.value}</h3>
                        {stat.suffix && (
                          <span className="text-lg text-amber-500">{stat.suffix}</span>
                        )}
                      </div>
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Bookings Chart */}
        <Card className="rounded-3xl overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Performance Overview
                </CardTitle>
                <CardDescription>Monthly bookings and revenue trends</CardDescription>
              </div>
              <div className="flex gap-1">
                <Button
                  variant={chartType === 'bar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('bar')}
                  className="rounded-lg"
                >
                  Bar
                </Button>
                <Button
                  variant={chartType === 'line' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('line')}
                  className="rounded-lg"
                >
                  Line
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart data={monthlyBookingsData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      formatter={(value: any, name: any) => [`$${value}`, 'Revenue']}
                    />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue ($)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={monthlyBookingsData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      formatter={(value: any, name: any) => [`$${value}`, 'Revenue']}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 6 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution Pie Chart */}
        <Card className="rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              Experience Categories
            </CardTitle>
            <CardDescription>Distribution of your experience types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value: any) => [`${value} experiences`, 'Count']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Category Summary */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t">
              {categoryDistribution.map((cat, idx) => (
                <div key={cat.name} className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                    <span className="text-xs text-muted-foreground">{cat.name}</span>
                  </div>
                  <p className="text-lg font-bold">{cat.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}