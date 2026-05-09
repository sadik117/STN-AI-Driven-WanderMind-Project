'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Calendar, User, MoreHorizontal, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function HostBookings() {
  const [search, setSearch] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const queryClient = useQueryClient();

  const { user } = useAuthStore();

  // Initialize socket connection for real-time notifications
  useEffect(() => {
    if (!user) return;

    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      withCredentials: true,
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected for host');
      socketInstance.emit('join', user.id);
    });

    socketInstance.on('notification', (notification) => {
      toast.info(`New notification: ${notification.title}`, {
        description: notification.message,
        duration: 5000,
      });
      // Invalidate queries to show the new booking/status change
      queryClient.invalidateQueries({ queryKey: ['host-bookings'] });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [queryClient]);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['host-bookings', search],
    queryFn: async () => {
      const res = await api.get('/bookings/host-bookings', {
        params: { search }
      });
      return res.data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string, status: string }) => {
      return await api.patch(`/bookings/${bookingId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-bookings'] });
      toast.success('Booking status updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update status');
    }
  });

  return (
    <div className="space-y-8">
      <DashboardHeader 
        title="Experience Bookings" 
        description="Manage reservations and guest requests for your experiences."
      />

      <Card className="rounded-3xl border-none shadow-xl shadow-primary/5">
        <CardContent className="p-0">
          <div className="p-6 border-b flex items-center justify-between gap-4">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by guest or experience..." 
                className="pl-10 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-6 py-4 text-sm font-semibold">Guest</th>
                  <th className="px-6 py-4 text-sm font-semibold">Experience</th>
                  <th className="px-6 py-4 text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-10 w-40" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-10 w-48" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-24" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                      <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 ml-auto" /></td>
                    </tr>
                  ))
                ) : bookings && bookings.length > 0 ? (
                  bookings.map((booking: any) => (
                    <tr key={booking.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs border">
                            {booking.traveler.user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{booking.traveler.user.name}</p>
                            <p className="text-[10px] text-muted-foreground">{booking.guests} Guests</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium line-clamp-1">{booking.experience.title}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={
                          booking.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-500 border-none' :
                          booking.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-none' :
                          booking.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-500 border-none' :
                          'bg-destructive/10 text-destructive border-none'
                        }>
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl">
                            <DropdownMenuLabel>Manage Booking</DropdownMenuLabel>
                            <DropdownMenuItem 
                              className="gap-2 text-destructive focus:text-destructive"
                              onClick={() => updateStatusMutation.mutate({ bookingId: booking.id, status: 'CANCELLED' })}
                            >
                              <XCircle className="h-4 w-4" /> Cancel
                            </DropdownMenuItem>
                            {booking.status === 'CONFIRMED' && (
                              <DropdownMenuItem 
                                className="gap-2 text-blue-600 focus:text-blue-600"
                                onClick={() => updateStatusMutation.mutate({ bookingId: booking.id, status: 'COMPLETED' })}
                              >
                                <CheckCircle className="h-4 w-4" /> Mark as Completed
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2">
                              <User className="h-4 w-4" /> Guest Profile
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No bookings found for your experiences.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
