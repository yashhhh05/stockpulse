import axios from 'axios';
import { Product, ActivityLog, WarehouseStats, StockMovementPayload, User } from '../types/index.ts';

// Create configured Axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token to requests automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('stockpulse_jwt_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Handle auth errors gracefully
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      console.warn('Session expired or unauthorized');
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authAPI = {
  login: async (email: string, password?: string): Promise<{ token: string; user: User }> => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (data: { name: string; email: string; password: string; role: string; facility: string }): Promise<{ token: string; user: User }> => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
  getCurrentUser: async (): Promise<User> => {
    const res = await api.get('/auth/me');
    return res.data;
  }
};

// Products Endpoints
export const productsAPI = {
  getAll: async (category?: string, search?: string): Promise<Product[]> => {
    const params: Record<string, string> = {};
    if (category && category.toLowerCase() !== 'all') params.category = category;
    if (search) params.search = search;
    const res = await api.get('/products', { params });
    return res.data;
  },
  getById: async (id: string): Promise<Product> => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  create: async (data: Partial<Product>): Promise<Product> => {
    const res = await api.post('/products', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Product>): Promise<Product> => {
    const res = await api.put(`/products/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<{ id: string }> => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
  moveStock: async (id: string, payload: StockMovementPayload): Promise<{ product: Product; activity: ActivityLog }> => {
    const res = await api.post(`/products/${id}/movement`, payload);
    return res.data;
  },
  quickReorder: async (id: string): Promise<{ product: Product; activity: ActivityLog }> => {
    const res = await api.post(`/products/${id}/reorder`, {});
    return res.data;
  }
};

// Activities Endpoints
export const activitiesAPI = {
  getAll: async (): Promise<ActivityLog[]> => {
    const res = await api.get('/activities');
    return res.data;
  }
};

// Stats Endpoints
export const statsAPI = {
  get: async (): Promise<WarehouseStats> => {
    const res = await api.get('/stats');
    return res.data;
  }
};

export default api;
