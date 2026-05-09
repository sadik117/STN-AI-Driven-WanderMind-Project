import api from '../lib/api';

export interface Booking {
  id: string;
  userId: string;
  experienceId: string;
  date: string;
  guests: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus: string;
  notes?: string;
  createdAt: string;
  experience: {
    id: string;
    title: string;
    price: number;
    destination: {
      name: string;
    };
    host: {
      user: {
        name: string;
        image?: string;
      };
    };
  };
}

export const bookingService = {
  getMyBookings: (params?: { page?: number; limit?: number; status?: string }) => 
    api.get('/bookings/my', { params }),
  createBooking: (data: any) => api.post('/bookings', data),
  getById: (id: string) => api.get(`/bookings/${id}`),
  cancelBooking: (id: string) => api.put(`/bookings/${id}/cancel`),
};

export const myBookingsQuery = (params?: { page?: number; limit?: number; status?: string }) => ({
  queryKey: ['bookings', 'my', params] as const,
  queryFn: async () => {
    const res = await bookingService.getMyBookings(params);
    return res;
  },

});

