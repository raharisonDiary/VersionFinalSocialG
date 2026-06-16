import { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Loader2, Users, Home, Search, MapPin } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const StatistiquePage = () => {
    const [stats, setStats] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchStats = async (district) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = district 
                ? `http://localhost:5296/api/Statistique/dashboard-data?district=${district}`
                : "http://localhost:5296/api/Statistique/dashboard-data";
                
            const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
            setStats(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchStats(selectedDistrict);
    }, [selectedDistrict]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
        </div>
    );

    if (!stats) return <div className="p-6 text-center text-slate-500">Données non disponibles.</div>;

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-4 md:p-8 max-w-6xl mx-auto"
        >
            <motion.h1 variants={itemVariants} className="text-3xl font-black text-slate-800 mb-8">Tableau de Bord</motion.h1>

            <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Rechercher un citoyen..." 
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300"
                    />
                </div>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-slate-400" size={20} />
                    <select 
                        className="pl-10 pr-8 py-3 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 appearance-none cursor-pointer" 
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                    >
                        <option value="">Tous les districts</option>
                        {stats.topDistricts && stats.topDistricts.map((d, i) => (
                            <option key={i} value={d.district}>{d.district}</option>
                        ))}
                    </select>
                </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 text-white rounded-3xl shadow-xl flex items-center justify-between">
                    <div>
                        <p className="text-indigo-100 text-sm font-bold uppercase tracking-wider">Total Citoyens</p>
                        <h3 className="text-4xl font-black mt-1">{stats.totalCitoyens}</h3>
                    </div>
                    <Users size={48} className="text-white/20" />
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white rounded-3xl shadow-xl flex items-center justify-between">
                    <div>
                        <p className="text-emerald-100 text-sm font-bold uppercase tracking-wider">Total Ménages</p>
                        <h3 className="text-4xl font-black mt-1">{stats.totalMenages}</h3>
                    </div>
                    <Home size={48} className="text-white/20" />
                </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <motion.div whileHover={{ scale: 1.01 }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-700 mb-6 text-center">Répartition par Sexe</h2>
                    <div className="h-64 flex justify-center">
                        <Pie data={{ 
                            labels: stats.parSexe.map(s => s.key), 
                            datasets: [{ data: stats.parSexe.map(s => s.count), backgroundColor: ['#3b82f6', '#f472b6'], borderWidth: 0 }] 
                        }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                    </div>
                </motion.div>
                <motion.div whileHover={{ scale: 1.01 }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-700 mb-6 text-center">Répartition par Âge</h2>
                    <div className="h-64">
                        <Bar data={{ 
                            labels: stats.parAge.map(a => a.key), 
                            datasets: [{ label: 'Population', data: stats.parAge.map(a => a.count), backgroundColor: '#8b5cf6', borderRadius: 8 }] 
                        }} options={{ maintainAspectRatio: false }} />
                    </div>
                </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Top 5 Districts</h2>
                <div className="h-72">
                    <Bar data={{ 
                        labels: stats.topDistricts.map(d => d.district), 
                        datasets: [{ label: 'Nombre de citoyens', data: stats.topDistricts.map(d => d.count), backgroundColor: '#f59e0b', borderRadius: 8 }] 
                    }} options={{ maintainAspectRatio: false, indexAxis: 'y' }} />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default StatistiquePage;