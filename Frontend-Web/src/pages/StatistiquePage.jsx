import { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const StatistiquePage = () => {
    const [stats, setStats] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState("");

    const fetchStats = (district) => {
        const token = localStorage.getItem('token');
        const url = district 
            ? `http://localhost:5296/api/Statistique/dashboard-data?district=${district}`
            : "http://localhost:5296/api/Statistique/dashboard-data";
            
        axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setStats(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchStats(selectedDistrict);
    }, [selectedDistrict]);

    if (!stats) return <div>Chargement...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Tableau de Bord</h1>

            <div className="flex gap-4 mb-8">
                <input 
                    type="text" 
                    placeholder="Rechercher un citoyen..." 
                    className="p-2 border rounded w-full"
                />
                <select 
                    className="p-2 border rounded" 
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                >
                    <option value="">Tous les districts</option>
                    {stats.topDistricts && stats.topDistricts.map((d, i) => (
                        <option key={i} value={d.district}>{d.district}</option>
                    ))}
                </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-blue-500 p-4 text-white rounded">Total Citoyens: {stats.totalCitoyens}</div>
                <div className="bg-green-500 p-4 text-white rounded">Total Ménages: {stats.totalMenages}</div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="h-64 bg-white p-4 shadow rounded">
                    <Pie data={{ 
                        labels: stats.parSexe.map(s => s.key), 
                        datasets: [{ data: stats.parSexe.map(s => s.count), backgroundColor: ['#3b82f6', '#f472b6'] }] 
                    }} />
                </div>
                <div className="h-64 bg-white p-4 shadow rounded">
                    <Bar data={{ 
                        labels: stats.parAge.map(a => a.key), 
                        datasets: [{ label: 'Population', data: stats.parAge.map(a => a.count), backgroundColor: '#8b5cf6' }] 
                    }} />
                </div>
            </div>

            <div className="bg-white p-6 shadow rounded">
                <h2 className="text-xl font-bold mb-4">Top 5 Districts</h2>
                <Bar data={{ 
                    labels: stats.topDistricts.map(d => d.district), 
                    datasets: [{ label: 'Nombre de citoyens', data: stats.topDistricts.map(d => d.count), backgroundColor: '#f59e0b' }] 
                }} />
            </div>
        </div>
    );
};

export default StatistiquePage;