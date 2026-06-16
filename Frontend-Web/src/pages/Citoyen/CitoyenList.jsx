import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Eye, ArrowLeft, Loader2, User, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import { getCitoyens, deleteCitoyen } from '../../services/citoyenService';

const CitoyenList = () => {
    const [citoyens, setCitoyens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const load = async () => {
        try {
            setLoading(true);
            const res = await getCitoyens(search);
            setCitoyens(Array.isArray(res.data) ? res.data : []);
        } catch {
            Swal.fire('Erreur', 'Impossible de charger la liste', 'error');
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { load(); }, [search]);

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: "Cette action est irréversible !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Supprimer'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteCitoyen(id);
                load();
            }
        });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl mx-auto px-2 md:px-4 py-6">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="h-28 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center px-4 md:px-6">
                    <button onClick={() => navigate(-1)} className="flex items-center text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full font-bold transition-all">
                        <ArrowLeft size={18} className="mr-2" /> Retour
                    </button>
                </div>

                <div className="px-4 md:px-6 pb-8 -mt-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 bg-white/90 p-4 rounded-2xl">
                        <h2 className="text-xl md:text-2xl font-black text-slate-800">Liste des Citoyens</h2>
                        <button 
                            onClick={() => navigate('/home/citoyens/add')} 
                            className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center shadow-lg transition-all"
                        >
                            <Plus size={20} className="mr-2" /> Ajouter
                        </button>
                    </div>

                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                        <input 
                            placeholder="Rechercher par nom ou CIN..." 
                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
                    ) : (
                        <div className="grid gap-3">
                            <AnimatePresence>
                                {citoyens.map((c) => (
                                    <motion.div 
                                        key={c.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="bg-slate-50 p-3 md:p-4 rounded-2xl border border-slate-100 flex flex-wrap items-center justify-between gap-3 hover:border-indigo-200 transition-all"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm bg-indigo-100 flex items-center justify-center">
                                                {c.photoPath ? (
                                                    <img src={`http://localhost:5296${c.photoPath}`} className="w-full h-full object-cover" alt={c.nom} />
                                                ) : <User className="text-indigo-400" size={24} />}
                                            </div>
                                            <div>
                                                <p className="text-sm md:text-base font-bold text-slate-800">{c.nom} {c.prenom}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{c.cin}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => navigate(`/home/citoyens/details/${c.id}`)} className="p-2.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"><Eye size={18}/></button>
                                            <button onClick={() => navigate(`/home/citoyens/edit/${c.id}`)} className="p-2.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"><Edit3 size={18}/></button>
                                            <button onClick={() => handleDelete(c.id)} className="p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"><Trash2 size={18}/></button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default CitoyenList;