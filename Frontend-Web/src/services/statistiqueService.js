import axios from 'axios';

const API_URL = "http://localhost:5296/api/Statistique";

// Raha manana token ianao dia ampiasao ity, raha tsy mbola misy dia esory ny header
const getHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getStatsPopulationParSexe = () => axios.get(`${API_URL}/population-par-sexe`, getHeader());