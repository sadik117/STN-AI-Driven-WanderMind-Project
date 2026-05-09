import api from "@/lib/api";

export interface AppStats {
  destinations: number;
  experiences: number;
  travelers: number;
  hosts: number;
  bookings: number;
  itineraries: number;
  reviews: number;
  blogs: number;
  featuredDestinations: number;
  avgDestinationRating: number;
}

// Plain query-options object — pass directly to useQuery()
export const appStatsQuery = {
  queryKey: ['stats', 'app'] as const,
  queryFn: async (): Promise<AppStats> => {
    const res = await api.get('/stats');
    return res.data as AppStats;
  },
  staleTime: 1000 * 60 * 5, // 5 minutes
};