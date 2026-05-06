import api from '../lib/api';

export const blogService = {
  getBlogs: (params?: any) => api.get('/blogs', { params }),
  getById: (id: string) => api.get(`/blogs/${id}`),
  createBlog: (data: any) => api.post('/blogs', data),
  updateBlog: (id: string, data: any) => api.put(`/blogs/${id}`, data),
  deleteBlog: (id: string) => api.delete(`/blogs/${id}`),
};
