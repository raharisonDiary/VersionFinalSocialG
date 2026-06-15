import axios from 'axios';

const baseURL = 'http://localhost:5296/api';

const api = axios.create({ baseURL });

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const publicApi = axios.create({ baseURL });

export default api;