import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('resumiq_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('resumiq_token', response.data.token);
            localStorage.setItem('resumiq_user', JSON.stringify(response.data));
        }
        return response.data;
    },
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('resumiq_token', response.data.token);
            localStorage.setItem('resumiq_user', JSON.stringify(response.data));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('resumiq_token');
        localStorage.removeItem('resumiq_user');
    },
    getCurrentUser: () => {
        const user = localStorage.getItem('resumiq_user');
        return user ? JSON.parse(user) : null;
    }
};

export const resumeService = {
    getAll: () => api.get('/resumes'),
    getById: (id) => api.get(`/resumes/${id}`),
    create: (data) => api.post('/resumes', data),
    update: (id, data) => api.put(`/resumes/${id}`, data),
    delete: (id) => api.delete(`/resumes/${id}`),
};

export default api;
