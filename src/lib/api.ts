import axios from 'axios';

// API Base URL - change this to your backend URL
// In development, you can use '/api' to leverage Vite's proxy
// In production, set VITE_API_URL environment variable to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:5000/api');

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging (optional)
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling (optional)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error: No response from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const eventsApi = {
  // Get all events with optional search and filters
  getAll: (params?: { 
    search?: string; 
    location?: string; 
    q?: string;
    latitude?: number;
    longitude?: number;
  }) => {
    return api.get('/events', { params });
  },

  // Get single event by ID
  getById: (id: string, params?: { latitude?: number; longitude?: number }) => {
    return api.get(`/events/${id}`, { params });
  },

  // Create new event
  create: (eventData: {
    title: string;
    description: string;
    location: string;
    date: string;
    maxParticipants: number;
  }) => {
    return api.post('/events', eventData);
  },
};

export default api;

