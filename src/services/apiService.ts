import axios from 'axios';

// Resolve baseURL safely for different environments (Next.js, Vite, or window)
const nextBaseUrl = typeof process !== 'undefined' ? (process.env?.NEXT_PUBLIC_API_URL as string | undefined) : undefined;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const viteBaseUrl = typeof import.meta !== 'undefined' ? ((import.meta as any).env?.VITE_API_URL as string | undefined) : undefined;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const windowBaseUrl = typeof window !== 'undefined' ? ((window as any).__API_URL__ as string | undefined) : undefined;

const BASE_URL = nextBaseUrl || viteBaseUrl || windowBaseUrl || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: config.data
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;