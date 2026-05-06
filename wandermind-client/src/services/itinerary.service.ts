import api from '../lib/api';

export const itineraryService = {
  getMyItineraries: () => api.get('/itineraries/my'),
  getById: (id: string) => api.get(`/itineraries/${id}`),
  saveItinerary: (data: any) => api.post('/itineraries', data),
  deleteItinerary: (id: string) => api.delete(`/itineraries/${id}`),
};
