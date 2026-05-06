import api from '../lib/api';

export const aiService = {
  generateItinerary: (data: any) => api.post('/ai/itinerary', data),
  chat: (data: any) => api.post('/ai/chat', data),
  generatePackingList: (data: any) => api.post('/ai/packing', data),
  analyzeBudget: (data: any) => api.post('/ai/budget', data),
  summarizeJournal: (data: any) => api.post('/ai/journal/summarize', data),
};
