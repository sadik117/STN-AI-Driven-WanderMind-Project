import api from '../lib/api';

export const bookingService = {
  getMyBookings: () => api.get('/bookings/my'),
  createBooking: (data: any) => api.post('/bookings', data),
  getById: (id: string) => api.get(`/bookings/${id}`),
  cancelBooking: (id: string) => api.put(`/bookings/${id}/cancel`),
};
