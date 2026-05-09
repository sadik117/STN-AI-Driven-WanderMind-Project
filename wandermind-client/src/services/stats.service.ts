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


export interface HostStats {
  experiences: {
    total: number;
    featured: number;
    categories: string[];
  };
  bookings: {
    total: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    pending: number;
  };
  revenue: {
    total: number;
    monthly: { month: string; revenue: number }[];
  };
  guests: {
    total: number;
    avgPerBooking: number;
  };
  reviews: {
    total: number;
    avgRating: number;
  };
  topExperience: {
    id: string;
    title: string;
    bookings: number;
    rating: number;
  } | null;
}

export const hostStatsQuery = {
  queryKey: ['stats', 'host'] as const,
  queryFn: async (): Promise<HostStats> => {
    const res = await api.get('/stats/host');
    return res.data as HostStats;
  },
  staleTime: 1000 * 60 * 5, // 5 minutes
};

export interface TravelerStats {
  totalBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
  totalSpent: number;
  itineraries: number;
  journalEntries: number;
  packingLists: number;
  reviews: number;
  wishlist: {
    count: number;
    continents: string[];
    avgRating: number;
  };
  continentsVisited: string[];
  countriesVisited: number;
}

export const travelerStatsQuery = {
  queryKey: ['stats', 'traveler'] as const,
  queryFn: async (): Promise<TravelerStats> => {
    const res = await api.get('/stats/traveler');
    return res.data as TravelerStats;
  },
  staleTime: 1000 * 60 * 5, // 5 minutes
};

