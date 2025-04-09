import axios from 'axios';

// Determine API base URL - this makes it work both locally and in production
const baseURL = process.env.NODE_ENV === 'production' 
  ? '/api'  // In production, use relative path
  : window.location.hostname.includes('replit.dev') 
    ? `https://${window.location.hostname.replace('5173', '5000')}/api` // For Replit dev
    : 'http://localhost:5000/api'; // Fallback for local dev

// Create a base axios instance with common configuration
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Dashboard data
export const getStats = async () => {
  try {
    const response = await api.get('/stats');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

export const getLogs = async () => {
  try {
    const response = await api.get('/logs');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

export const getUpcomingExperiments = async () => {
  try {
    const response = await api.get('/experiments/upcoming');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

export default api;