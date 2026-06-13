import { api } from './client';
import type {
  AuthResponse,
  Company,
  CompanyInput,
  DashboardStats,
  Product,
  ProductInput,
} from '../types';

export const authApi = {
  login: (username: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { username, password }).then((r) => r.data),
  register: (username: string, password: string) =>
    api.post<AuthResponse>('/auth/register', { username, password }).then((r) => r.data),
};

export const companiesApi = {
  list: () => api.get<Company[]>('/companies').then((r) => r.data),
  create: (input: CompanyInput) => api.post<Company>('/companies', input).then((r) => r.data),
  update: (id: number, input: CompanyInput) =>
    api.put<Company>(`/companies/${id}`, input).then((r) => r.data),
  remove: (id: number) => api.delete(`/companies/${id}`).then((r) => r.data),
};

export const productsApi = {
  list: () => api.get<Product[]>('/products').then((r) => r.data),
  create: (input: ProductInput) => api.post<Product>('/products', input).then((r) => r.data),
  update: (id: number, input: ProductInput) =>
    api.put<Product>(`/products/${id}`, input).then((r) => r.data),
  remove: (id: number) => api.delete(`/products/${id}`).then((r) => r.data),
};

export const statsApi = {
  dashboard: () => api.get<DashboardStats>('/stats').then((r) => r.data),
};
