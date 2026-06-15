import api from './api';

export const getMenages = () => api.get('/Menage');
export const getMenageById = (id) => api.get(`/Menage/${id}`);
export const createMenage = (data) => api.post('/Menage', data);

export const updateMenage = (id, data) => api.post(`/Menage/update/${id}`, data);

export const deleteMenage = (id) => api.delete(`/Menage/${id}`);