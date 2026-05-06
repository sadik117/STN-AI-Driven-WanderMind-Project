import api from '../lib/api';

export const reviewService = {
  createReview: (data: any) => api.post('/reviews', data),
  getDestinationReviews: (destinationId: string) => api.get(`/reviews/destination/${destinationId}`),
  getExperienceReviews: (experienceId: string) => api.get(`/reviews/experience/${experienceId}`),
  deleteReview: (id: string) => api.delete(`/reviews/${id}`),
};
