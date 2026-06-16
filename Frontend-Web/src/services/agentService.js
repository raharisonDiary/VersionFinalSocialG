import axios from 'axios';

const API_URL = 'http://localhost:5296/api/Agent';

const getAuthHeaders = () => ({
    headers: { 
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data' 
    }
});

const agentService = {
    getAll: () => axios.get(API_URL, getAuthHeaders()),
    
    getById: (id) => axios.get(`${API_URL}/${id}`, getAuthHeaders()),
    
    create: (data) => axios.post(API_URL, data, getAuthHeaders()),
    
    update: (id, data) => axios.put(`${API_URL}/${id}`, data, getAuthHeaders()),
    
    delete: (id) => axios.delete(`${API_URL}/${id}`, getAuthHeaders()),

    generateQrUrl: (id) => `${API_URL}/qr/${id}`,

    getQrBlob: async (id) => {
        const response = await axios.get(`${API_URL}/qr/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            responseType: 'blob'
        });
        return URL.createObjectURL(response.data);
    }
};

export default agentService;