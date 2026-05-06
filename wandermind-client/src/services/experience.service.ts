import api from '../lib/api';

export const experienceService = {
  getExperiences: (params?: any) => api.get('/experiences', { params }),
  getFeatured: () => api.get('/experiences/featured'),
  getById: (id: string) => api.get(`/experiences/${id}`),
};
