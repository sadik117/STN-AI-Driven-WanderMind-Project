'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Calendar, CreditCard, Star, Info, CheckCheck } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/useAuthStore';
import { io } from 'socket.io-client';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NotificationDropdown() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Initial fetch
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/users/notifications') as any;
        if (res.data) {
          setNotifications(res.data.notifications || []);
          setUnreadCount(res.data.unreadCount || 0);
          setTotalCount(res.data.notifications?.length || 0);
        }
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };

    fetchNotifications();

    // Socket connection
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      withCredentials: true
    });

    socket.emit('join', user.id);

    socket.on('notification', (notification: any) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      setTotalCount(prev => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/users/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    setIsMarkingAll(true);
    try {
      await api.post('/users/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error(err);
    } finally {
      setIsMarkingAll(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'BOOKING': 
      case 'BOOKING_UPDATE': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'PAYMENT': return <CreditCard className="h-4 w-4 text-emerald-500" />;
      case 'REVIEW': return <Star className="h-4 w-4 text-amber-500" />;
      default: return <Info className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary/10">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-2xl p-0 border-border/50 shadow-2xl overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-primary/10 to-transparent flex items-center justify-between">
          <div className="flex flex-col">
            <DropdownMenuLabel className="p-0 font-bold">Notifications</DropdownMenuLabel>
            <span className="text-[10px] text-muted-foreground">{unreadCount} unread, {totalCount} total</span>
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-[10px] gap-1 hover:bg-primary/20 text-primary rounded-full"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                markAllAsRead();
              }}
              disabled={isMarkingAll}
            >
              <CheckCheck className="h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <DropdownMenuItem 
                key={n.id} 
                className={`p-4 cursor-pointer focus:bg-muted/50 border-b border-border/30 last:border-0 ${!n.read ? 'bg-primary/5' : ''}`}
                onClick={() => !n.read && markAsRead(n.id)}
              >
                <div className="flex gap-3 w-full">
                  <div className="mt-1 h-8 w-8 rounded-full bg-background border flex items-center justify-center shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className={`text-sm leading-tight ${!n.read ? 'font-semibold' : ''}`}>{n.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground pt-1">{formatDistanceToNow(new Date(n.createdAt))} ago</p>
                  </div>
                  {!n.read && (
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  )}
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No notifications yet</p>
            </div>
          )}
        </div>
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="m-0" />
            <div className="p-2 bg-muted/30">
              <Link href="/notifications">
                <Button variant="ghost" size="sm" className="w-full text-xs hover:bg-primary/10">View All</Button>
              </Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
