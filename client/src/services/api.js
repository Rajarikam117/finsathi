import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const calculatorAPI = {
  calculateEPF: (data) => api.post('/calculate/epf', data),
  calculatePPF: (data) => api.post('/calculate/ppf', data),
  calculateNPS: (data) => api.post('/calculate/nps', data),
  calculateSIP: (data) => api.post('/calculate/sip', data),
};

export const advisorAPI = {
  chat: (message, history = []) => api.post('/advisor/chat', { message, history }),
  getSuggestions: () => api.get('/advisor/suggestions'),
};

export const portfolioAPI = {
  getSummary: () => api.get('/portfolio/summary'),
  save: (data) => api.post('/portfolio/save', data),
};

export default api;
