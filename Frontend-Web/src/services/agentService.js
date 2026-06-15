import axios from 'axios';

const API_URL = 'http://localhost:5296/api/User';

const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

const agentService = {
    getAll: () => axios.get(API_URL, getAuthHeaders()),
    
    getById: (id) => axios.get(`${API_URL}/${id}`, getAuthHeaders()),
    
    create: (data) => axios.post(`${API_URL}/create`, data, getAuthHeaders()),
    
    delete: (id) => axios.delete(`${API_URL}/${id}`, getAuthHeaders())
};

export default agentService;