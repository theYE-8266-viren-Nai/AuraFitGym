import api from '../lib/axios';
import { AuthResponse, LoginData, RegisterData, User } from '../types';

export const authApi = {
  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/register', data);
    return response.data;
  },

  // Login user
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/login', data);
    return response.data;
  },

  // Logout user
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/logout');
    return response.data;
  },

  // Get current user
  me: async (): Promise<User> => {
    const response = await api.get<User>('/me');
    return response.data;
  },
};