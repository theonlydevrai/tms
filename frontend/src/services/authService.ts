/**
 * Authentication Service
 * API calls for authentication (UC1, UC2, UC4, UC5)
 */

import api from './api';

export interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
  user_type?: string; // Admin: 'ADMINISTRATOR', Customer: 'CUSTOMER'
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export const authService = {
  // UC1: Register
  register: async (data: RegisterData): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/register', data);
  },

  // UC2: Login
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/login', { email, password });
  },

  // UC4: Forgot Password
  forgotPassword: async (email: string): Promise<any> => {
    return api.post('/auth/forgot-password', { email });
  },

  // UC5: Reset Password
  resetPassword: async (token: string, newPassword: string): Promise<any> => {
    return api.post('/auth/reset-password', { token, newPassword });
  },

  // Get Profile
  getProfile: async (): Promise<any> => {
    return api.get('/auth/profile');
  },

  // UC3: Update Profile
  updateProfile: async (data: { name?: string; phoneNumber?: string }): Promise<any> => {
    return api.put('/auth/profile', data);
  },

  // Change Password
  changePassword: async (currentPassword: string, newPassword: string): Promise<any> => {
    return api.post('/auth/change-password', { currentPassword, newPassword });
  },

  // Logout
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
};
