'use client';

import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Trash2,
  Calendar,
  Star,
  Info,
  CreditCard,
  Clock,
  Inbox
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export default function NotificationsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 pb-8">
        <DashboardHeader
          title="Notifications"
          description="Stay updated with your travel bookings and account activity."
        />
        <Card className="border-none shadow-xl shadow-primary/5 overflow-hidden rounded-3xl">
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="p-6 flex gap-4 animate-pulse">
                  <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-1/3 rounded-lg" />
                    <Skeleton className="h-4 w-3/4 rounded-lg" />
                    <Skeleton className="h-3 w-20 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/users/notifications') as any;
      if (res.data) {
        setNotifications(res.data.notifications || []);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/users/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.delete(`/users/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete notification');
    }
  };

  const getIcon = (type: string) => {
    const iconProps = { className: "h-5 w-5" };
    switch (type) {
      case 'BOOKING':
      case 'BOOKING_UPDATE':
        return <Calendar {...iconProps} className="text-blue-500" />;
      case 'PAYMENT':
        return <CreditCard {...iconProps} className="text-emerald-500" />;
      case 'REVIEW':
        return <Star {...iconProps} className="text-amber-500" />;
      default:
        return <Info {...iconProps} className="text-primary" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto py-8 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <DashboardHeader
          title="Notifications"
          description="Stay updated with your travel bookings and account activity."
        />
      </div>

      <Card className="border-none shadow-xl shadow-primary/5 overflow-hidden rounded-3xl">
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="p-6 flex gap-4 animate-pulse">
                  <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-1/3 rounded-lg" />
                    <Skeleton className="h-4 w-3/4 rounded-lg" />
                    <Skeleton className="h-3 w-20 rounded-lg" />
                  </div>
                </div>
              ))
            ) : notifications.length > 0 ? (
              <AnimatePresence initial={false}>
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`group relative p-6 transition-all duration-300 hover:bg-muted/30 ${!notification.read ? 'bg-primary/5' : ''
                      }`}
                  >
                    {!notification.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                    )}

                    <div className="flex gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-background border shadow-sm flex items-center justify-center shrink-0">
                        {getIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <h4 className={`text-base font-bold ${!notification.read ? 'text-primary' : 'text-foreground'}`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {notification.message}
                            </p>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                            onClick={(e) => deleteNotification(notification.id, e)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </div>
                            {!notification.read && (
                              <Badge variant="default" className="text-[10px] px-2 py-0 h-5">New</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="py-24 text-center">
                <div className="h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-6">
                  <Inbox className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-xl font-bold mb-2">No notifications found</h3>
                <p className="text-muted-foreground">
                  You're all caught up! When you receive new updates, they'll appear here.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
