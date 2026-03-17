import axios from 'axios';

// Create axios instance with base URL
const envUrl = import.meta.env.VITE_API_URL;
const baseUrl = envUrl
    ? (envUrl.endsWith('/api') ? envUrl : envUrl.replace(/\/$/, '') + '/api')
    : '/api';

export const api = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token and redirect to login if unauthorized
            localStorage.removeItem('token');
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                window.location.href = '/login';
            }
        }
        
        // Sanitize error message to prevent React Error #31
        if (error.response?.data?.error) {
            const apiError = error.response.data.error;
            if (typeof apiError === 'object') {
                error.response.data.error = apiError.message || JSON.stringify(apiError);
            }
        }

        return Promise.reject(error);
    }
);


export const deleteInterview = (interviewId) => {
    return api.delete(`/interviews/${interviewId}`);
};

export default api;