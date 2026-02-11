import axios from 'axios';

// Get the URL from env or default to localhost
const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Robust URL cleaning: remove trailing slashes and ensure it ends with /api
const cleanApiUrl = rawBaseUrl.replace(/\/+$/, '').endsWith('/api') 
  ? rawBaseUrl.replace(/\/+$/, '')
  : `${rawBaseUrl.replace(/\/+$/, '')}/api`;

// The BASE_URL for images (without /api)
export const BASE_URL = cleanApiUrl.replace('/api', '');

const api = axios.create({
  baseURL: cleanApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
