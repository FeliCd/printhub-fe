import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
});

// Interceptor automatically attaches token if available
api.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const get = (endpoint: string, params?: any) => api.get(endpoint, { params });

export const post = (endpoint: string, data?: any) => api.post(endpoint, data);

export const put = (endpoint: string, data?: any, config?: any) => api.put(endpoint, data, config);

export const remove = (endpoint: string) => api.delete(endpoint);

export default api;
