import axios from 'axios';

const API_URL = 'http://localhost:5296/api/Agent';

const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

const agentService = {
    getAll: () => axios.get(API_URL, getAuthHeaders()),
    getById: (id) => axios.get(`${API_URL}/${id}`, getAuthHeaders()),
    
    // Nesorina ny 'Content-Type' mba hamela ny navigateur hanao azy ho azy
    create: (data) => axios.post(API_URL, data, { 
        headers: { 
            ...getAuthHeaders().headers
        } 
    }),
    
    // Nesorina ny 'Content-Type'
    update: (id, data) => axios.put(`${API_URL}/${id}`, data, { 
        headers: { 
            ...getAuthHeaders().headers
        } 
    }),
    
    delete: (id) => axios.delete(`${API_URL}/${id}`, getAuthHeaders())
};

export default agentService;