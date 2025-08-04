import axios from 'axios';
import { isTokenExpired } from './token';

const instance = axios.create({
  baseURL: 'http://localhost:3000/', // Replace with your backend URL
});

// Request interceptor
instance.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config; // SSR-safe
  const token = localStorage.getItem('token');
  if (token && !isTokenExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor 
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
