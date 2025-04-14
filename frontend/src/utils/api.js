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

// Static Data for Development
const staticData = {
  stats: {
    servers: 12,
    dockerHosts: 5,
    containers: 27,
    experiments: 8
  },
  logs: [
    {
      id: 1,
      target_type: 'server',
      target_name: 'prod-web-01',
      action: 'restart',
      status: 'success',
      execution_time: '2025-04-13T08:30:00Z',
      details: 'Server restarted successfully'
    },
    {
      id: 2,
      target_type: 'container',
      target_name: 'api-container-1',
      action: 'stop',
      status: 'success',
      execution_time: '2025-04-13T10:15:00Z',
      details: 'Container stopped successfully'
    },
    {
      id: 3,
      target_type: 'server',
      target_name: 'db-server-02',
      action: 'stop',
      status: 'failure',
      execution_time: '2025-04-12T14:45:00Z',
      details: 'Failed to establish SSH connection'
    },
    {
      id: 4,
      target_type: 'container',
      target_name: 'worker-container-3',
      action: 'start',
      status: 'success',
      execution_time: '2025-04-12T16:20:00Z',
      details: 'Container started successfully'
    },
    {
      id: 5,
      target_type: 'server',
      target_name: 'cache-server-01',
      action: 'restart',
      status: 'success',
      execution_time: '2025-04-12T11:05:00Z',
      details: 'Server restarted successfully'
    },
    {
      id: 6,
      target_type: 'container',
      target_name: 'frontend-container-2',
      action: 'restart',
      status: 'success',
      execution_time: '2025-04-11T09:30:00Z',
      details: 'Container restarted successfully'
    }
  ],
  upcomingExperiments: [
    {
      id: 1,
      name: 'API Server Restart',
      description: 'Test resilience of API cluster during server restart',
      target_type: 'server',
      target_id: 3,
      action: 'restart',
      schedule_type: 'one_time',
      scheduled_time: '2025-04-15T10:00:00Z',
      active: true
    },
    {
      id: 2,
      name: 'Database Failover Test',
      description: 'Simulate primary database failure',
      target_type: 'container',
      target_id: 5,
      action: 'stop',
      schedule_type: 'recurring',
      recurring_pattern: 'Every Monday at 3:00 AM',
      active: true
    },
    {
      id: 3,
      name: 'Cache Server Restart',
      description: 'Test application performance during cache server restart',
      target_type: 'server',
      target_id: 7,
      action: 'restart',
      schedule_type: 'one_time',
      scheduled_time: '2025-04-18T08:30:00Z',
      active: true
    }
  ]
};

// Authentication
export const login = async (credentials) => {
  try {
    // For development, we'll skip the actual API call and return a successful response
    // In production, this would use the API call below
    // const response = await api.post('/auth/login', credentials);
    return {
      token: 'fake-jwt-token',
      user: {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        isAdmin: true
      }
    };
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Dashboard data
export const getStats = async () => {
  try {
    // Use static data instead of API call for development
    // const response = await api.get('/stats');
    // return response.data;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return staticData.stats;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

export const getLogs = async () => {
  try {
    // Use static data instead of API call for development
    // const response = await api.get('/logs');
    // return response.data;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return staticData.logs;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

export const getUpcomingExperiments = async () => {
  try {
    // Use static data instead of API call for development
    // const response = await api.get('/experiments/upcoming');
    // return response.data;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    return staticData.upcomingExperiments;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

export default api;