import api from '../lib/api';

export const destinationService = {
  getDestinations: (params?: any) => api.get('/destinations', { params }),
  getFeatured: () => api.get('/destinations/featured'),
  getBySlug: (slug: string) => api.get(`/destinations/${slug}`),
  toggleWishlist: (id: string) => api.post(`/destinations/${id}/wishlist`),
};
