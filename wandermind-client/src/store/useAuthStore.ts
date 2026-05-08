import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'TRAVELER' | 'HOST' | 'ADMIN';
  image?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // initial state before checking local storage
  
  login: (user, token) => {
    localStorage.setItem('wandermind_token', token);
    localStorage.setItem('wandermind_user', JSON.stringify(user));
    set({ user, isAuthenticated: true, isLoading: false });
  },

  updateUser: (user) => {
    localStorage.setItem('wandermind_user', JSON.stringify(user));
    set({ user });
  },
  
  logout: () => {
    localStorage.removeItem('wandermind_token');
    localStorage.removeItem('wandermind_user');
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
  
  checkAuth: () => {
    try {
      const token = localStorage.getItem('wandermind_token');
      const userStr = localStorage.getItem('wandermind_user');
      
      if (token && userStr) {
        set({ user: JSON.parse(userStr), isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (e) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
