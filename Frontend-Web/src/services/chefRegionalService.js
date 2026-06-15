import axios from 'axios';

const API_URL = "http://localhost:5296/api/ChefRegional";

const getHeaders = (isMultipart = false) => {
    const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    };
    if (!isMultipart) {
        config.headers['Content-Type'] = 'application/json';
    }
    return config;
};

const getAll = () => axios.get(API_URL, getHeaders());

const getById = (id) => axios.get(`${API_URL}/${id}`, getHeaders());

const create = (data) => axios.post(API_URL, data, getHeaders(true));

const update = (id, data) => axios.post(`${API_URL}/update/${id}`, data, getHeaders(true));

const deleteChef = (id) => axios.delete(`${API_URL}/${id}`, getHeaders());

export default { getAll, getById, create, update, delete: deleteChef };