import api from './api';

export const getCitoyens = (search = '') => api.get(`/Citoyen?search=${search}`);
export const getCitoyenById = (id) => api.get(`/Citoyen/${id}`);
export const createCitoyen = (data) => api.post('/Citoyen', data);
export const updateCitoyen = (id, data) => api.put(`/Citoyen/${id}`, data);
export const deleteCitoyen = (id) => api.delete(`/Citoyen/${id}`);