import axios from 'axios';

const API_URL = 'http://localhost:5296/api/Rapport';

const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

const rapportService = {
    send: (data) => axios.post(`${API_URL}/send`, data, getAuthHeaders()),
    getAll: () => axios.get(API_URL, getAuthHeaders()),
    markAsSeen: (id) => axios.put(`${API_URL}/mark-seen/${id}`, {}, getAuthHeaders()),
    reply: (id, message) => axios.post(`${API_URL}/reply/${id}`, JSON.stringify(message), {
        headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeaders().headers 
        }
    })
};

export default rapportService;