import api from '../lib/api';

export interface PackingList {
  id: string;
  userId: string;
  destination: string;
  tripType: string;
  startDate?: string;
  endDate?: string;
  itemsJson: any;
  createdAt: string;
  updatedAt: string;
}


export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  getMyPackingLists: () => api.get('/users/packing-lists'),
  getMyJournals: () => api.get('/users/journals'),
};

export const myPackingListsQuery = {
  queryKey: ['users', 'packing-lists'] as const,
  queryFn: async (): Promise<PackingList[]> => {
    const res = await userService.getMyPackingLists();
    return res.data;
  },
};

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  rawNotes: string;
  aiSummary?: string;
  highlights: string[];
  hashtags: string[];
  destination: string;
  travelDate: string;
  createdAt: string;
  updatedAt: string;
}

export const myJournalsQuery = {
  queryKey: ['users', 'journals'] as const,
  queryFn: async (): Promise<JournalEntry[]> => {
    const res = await userService.getMyJournals();
    return res.data;
  },
};

