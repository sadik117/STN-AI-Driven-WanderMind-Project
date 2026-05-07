import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  // In a real app with HttpOnly cookies, we don't need to manually attach tokens.
  // But if we are using localStorage for the token:
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('wandermind_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;
