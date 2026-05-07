'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2,
  Download,
  Filter,
  DollarSign,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  BellRing
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { io } from 'socket.io-client';

interface Booking {
  id: string;
  date: string;
  guests: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus: string;
  notes: string | null;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  experience: {
    title: string;
    price: number;
  };
}

const statusColors = {
  PENDING: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  CONFIRMED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
  COMPLETED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

const statusIcons = {
  PENDING: Clock,
  CONFIRMED: CheckCircle,
  CANCELLED: XCircle,
  COMPLETED: CheckCircle,
};

const paymentStatusColors = {
  paid: 'bg-emerald-500/10 text-emerald-500',
  unpaid: 'bg-red-500/10 text-red-500',
  refunded: 'bg-amber-500/10 text-amber-500',
};

export default function AdminBookings() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const limit = 10;

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      withCredentials: true,
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected for admin');
    });

    socketInstance.on('notification', (notification) => {
      toast.info(`New notification: ${notification.title}`, {
        description: notification.message,
        duration: 5000,
      });
      setRecentNotifications(prev => [notification, ...prev].slice(0, 10));
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [queryClient]);

  // Fetch bookings
  const { data: bookingsData, isLoading, refetch } = useQuery({
    queryKey: ['admin-bookings', page, statusFilter, search],
    queryFn: async () => {
      const res = await api.get('/admin/bookings', {
        params: { 
          page, 
          limit, 
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          search: search || undefined
        }
      });
      return res.data;
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  // Update booking status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ bookingId, status, notes }: { bookingId: string; status: string; notes?: string }) => {
      const res = await api.patch(`/bookings/${bookingId}/status`, { status, notes });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success(`Booking ${data.status.toLowerCase()} successfully`, {
        description: `The customer has been notified via email and in-app notification.`,
      });
      setIsStatusDialogOpen(false);
      setSelectedBooking(null);
            setAdminNotes('');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update booking status');
    }
  });

  const handleStatusChange = (booking: Booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setIsStatusDialogOpen(true);
  };

  const confirmStatusUpdate = () => {
    if (selectedBooking && newStatus && newStatus !== selectedBooking.status) {
      updateStatusMutation.mutate({ 
        bookingId: selectedBooking.id, 
        status: newStatus,
        notes: adminNotes 
      });
    } else {
      setIsStatusDialogOpen(false);
    }
  };

  const viewBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewDialogOpen(true);
  };

  const totalPages = Math.ceil((bookingsData?.total || 0) / limit);

  // Calculate statistics
  const stats = {
    total: bookingsData?.total || 0,
    pending: bookingsData?.stats?.PENDING || 0,
    confirmed: bookingsData?.stats?.CONFIRMED || 0,
    completed: bookingsData?.stats?.COMPLETED || 0,
    cancelled: bookingsData?.stats?.CANCELLED || 0,
    totalRevenue: bookingsData?.totalRevenue || 0,
  };

  const getStatusMessage = (oldStatus: string, newStatus: string) => {
    if (newStatus === 'CONFIRMED' && oldStatus === 'PENDING') {
      return {
        title: 'Confirm Booking',
        message: 'This will send a confirmation email and notification to the customer.',
        color: 'emerald'
      };
    } else if (newStatus === 'CANCELLED') {
      return {
        title: 'Cancel Booking',
        message: 'This will cancel the booking and trigger an automatic refund process if payment was made. The customer will be notified immediately.',
        color: 'red'
      };
    } else if (newStatus === 'COMPLETED') {
      return {
        title: 'Complete Booking',
        message: 'Marking this as completed will finalize the booking and release any pending payments to the host.',
        color: 'blue'
      };
    }
    return null;
  };

  const handleExportReport = async () => {
    try {
      const response = await api.get('/bookings/export', {
        params: { status: statusFilter !== 'ALL' ? statusFilter : undefined },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bookings_export_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Report exported successfully');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  return (
    <div className="space-y-8">
      <DashboardHeader 
        title="Booking Management"
        description="View and manage all customer bookings across the platform with real-time updates."
      >
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2 rounded-xl"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 rounded-xl"
            onClick={handleExportReport}
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 rounded-xl relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <BellRing className="h-4 w-4" />
            Notifications
            {recentNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {recentNotifications.length}
              </span>
            )}
          </Button>
        </div>
      </DashboardHeader>

      {/* Notifications Panel */}
      {showNotifications && (
        <Card className="absolute right-4 top-20 w-96 z-50 shadow-2xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Recent Notifications</CardTitle>
            <CardDescription>Real-time booking updates</CardDescription>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            {recentNotifications.length > 0 ? (
              <div className="space-y-3">
                {recentNotifications.map((notif, idx) => (
                  <div key={idx} className="p-3 bg-muted/30 rounded-xl">
                    <p className="font-semibold text-sm">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(notif.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No new notifications</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
                <p className="text-xs text-muted-foreground mt-1">All time bookings</p>
              </div>
              <div className="bg-primary/10 text-primary p-3 rounded-xl">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <h3 className="text-2xl font-bold mt-1 text-amber-500">{stats.pending}</h3>
                <p className="text-xs text-muted-foreground mt-1">Awaiting confirmation</p>
              </div>
              <div className="bg-amber-500/10 text-amber-500 p-3 rounded-xl">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <h3 className="text-2xl font-bold mt-1 text-emerald-500">{stats.completed}</h3>
                <p className="text-xs text-muted-foreground mt-1">Successfully completed</p>
              </div>
              <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-xl">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">${stats.totalRevenue.toLocaleString()}</h3>
                <p className="text-xs text-muted-foreground mt-1">From confirmed bookings</p>
              </div>
              <div className="bg-violet-500/10 text-violet-500 p-3 rounded-xl">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>
            Manage and track all customer bookings, update statuses, and handle cancellations in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by user, email, or experience..." 
                className="pl-10 rounded-xl"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}>
              <SelectTrigger className="w-[180px] rounded-xl">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-3 text-sm font-semibold">Booking ID</th>
                  <th className="px-4 py-3 text-sm font-semibold">Customer</th>
                  <th className="px-4 py-3 text-sm font-semibold">Experience</th>
                  <th className="px-4 py-3 text-sm font-semibold">Date</th>
                  <th className="px-4 py-3 text-sm font-semibold">Guests</th>
                  <th className="px-4 py-3 text-sm font-semibold">Total</th>
                  <th className="px-4 py-3 text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-sm font-semibold">Payment</th>
                  <th className="px-4 py-3 text-sm font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-12" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-6 w-20" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-6 w-16" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-8 w-20 ml-auto" /></td>
                    </tr>
                  ))
                ) : bookingsData?.bookings?.length > 0 ? (
                  bookingsData.bookings.map((booking: Booking) => {
                    const StatusIcon = statusIcons[booking.status as keyof typeof statusIcons];
                    return (
                      <tr key={booking.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs">{booking.id.slice(0, 8)}...</span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-sm">{booking.user.name}</p>
                            <p className="text-xs text-muted-foreground">{booking.user.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium">{booking.experience.title}</p>
                          <p className="text-xs text-muted-foreground">${booking.experience.price} per person</p>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {new Date(booking.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm">{booking.guests}</td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-sm">${booking.totalPrice}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`${statusColors[booking.status as keyof typeof statusColors]} rounded-full px-3 py-1 gap-1`}>
                            <StatusIcon className="h-3 w-3" />
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`${paymentStatusColors[booking.paymentStatus as keyof typeof paymentStatusColors]} rounded-full px-3`}>
                            {booking.paymentStatus}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-2 justify-end">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-1 rounded-lg"
                              onClick={() => viewBookingDetails(booking)}
                            >
                              <Eye className="h-3 w-3" />
                              View
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="gap-1 rounded-lg"
                              onClick={() => handleStatusChange(booking)}
                            >
                              <CheckCircle className="h-3 w-3" />
                              Update
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                      <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t flex-wrap gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, bookingsData?.total || 0)} of {bookingsData?.total || 0} bookings
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="gap-1 rounded-xl"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        className="w-9 rounded-xl"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="gap-1 rounded-xl"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Booking Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-heading">Booking Details</DialogTitle>
            <DialogDescription>
              Complete information about this booking.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Booking ID</Label>
                  <p className="font-mono text-sm mt-1">{selectedBooking.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Created At</Label>
                  <p className="text-sm mt-1">{new Date(selectedBooking.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <p className="text-sm mt-1">{selectedBooking.user.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="text-sm mt-1">{selectedBooking.user.email}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Experience Details</h4>
                <div>
                  <Label className="text-muted-foreground">Title</Label>
                  <p className="text-sm mt-1">{selectedBooking.experience.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <Label className="text-muted-foreground">Date</Label>
                    <p className="text-sm mt-1">{new Date(selectedBooking.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Guests</Label>
                    <p className="text-sm mt-1">{selectedBooking.guests} people</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Payment Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Total Price</Label>
                    <p className="text-lg font-bold mt-1">${selectedBooking.totalPrice}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Payment Status</Label>
                    <Badge className={`${paymentStatusColors[selectedBooking.paymentStatus as keyof typeof paymentStatusColors]} mt-1`}>
                      {selectedBooking.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Notes</h4>
                  <p className="text-sm text-muted-foreground">{selectedBooking.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)} className="rounded-xl">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-heading">Update Booking Status</DialogTitle>
            <DialogDescription>
              Change the status of this booking. The customer will be notified immediately.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="status">New Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending - Awaiting confirmation</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed - Booking approved</SelectItem>
                    <SelectItem value="COMPLETED">Completed - Experience finished</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled - Booking cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Admin Notes (Optional)</Label>
                <Textarea 
                  id="notes"
                  placeholder="Add internal notes or reason for status change..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="rounded-xl min-h-[100px]"
                />
              </div>

              {getStatusMessage(selectedBooking.status, newStatus) && (
                <div className={`bg-${getStatusMessage(selectedBooking.status, newStatus)?.color}-500/10 border border-${getStatusMessage(selectedBooking.status, newStatus)?.color}-500/20 rounded-xl p-3 text-sm text-${getStatusMessage(selectedBooking.status, newStatus)?.color}-600`}>
                  {newStatus === 'CONFIRMED' && selectedBooking.status === 'PENDING' && (
                    <>
                      <strong>✓ Confirm Booking</strong>
                      <p className="mt-1">This will send a confirmation email and push notification to the customer. The host will also be notified.</p>
                    </>
                  )}
                  {newStatus === 'CANCELLED' && (
                    <>
                      <strong>⚠️ Cancel Booking</strong>
                      <p className="mt-1">This will cancel the booking and trigger an automatic refund process if payment was made. The customer and host will be notified immediately via email and in-app notification.</p>
                    </>
                  )}
                  {newStatus === 'COMPLETED' && selectedBooking.status === 'CONFIRMED' && (
                    <>
                      <strong>✓ Complete Booking</strong>
                      <p className="mt-1">Marking this as completed will finalize the booking and release any pending payments to the host. A review request will be sent to the customer.</p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button 
              onClick={confirmStatusUpdate} 
              className="rounded-xl gap-2"
              disabled={updateStatusMutation.isPending || newStatus === selectedBooking?.status}
            >
              {updateStatusMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Update & Notify Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}