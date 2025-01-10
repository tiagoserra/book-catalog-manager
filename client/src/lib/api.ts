import axios from 'axios';
import type { Book, BookFormData } from '@/types/book';

const api = axios.create({
  baseURL: 'https://meusite.com.br/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const bookApi = {
  getAll: () => api.get<Book[]>('/book').then(res => res.data),
  getById: (id: number) => api.get<Book>(`/book/${id}`).then(res => res.data),
  create: (data: BookFormData) => api.post<Book>('/book', data).then(res => res.data),
  update: (id: number, data: BookFormData) => api.put<Book>(`/book/${id}`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/book/${id}`).then(res => res.data)
};
