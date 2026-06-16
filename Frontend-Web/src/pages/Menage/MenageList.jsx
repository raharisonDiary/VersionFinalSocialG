import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Eye, ArrowLeft, Loader2, Home } from 'lucide-react';
import Swal from 'sweetalert2';
import { getMenages, deleteMenage } from '../../services/menageService';

const MenageList = () => {
    const [menages, setMenages] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const load = async () => {
        try {
            const res = await getMenages();
            setMenages(res.data);
        } catch {
            Swal.fire('Erreur', 'Impossible de charger la liste', 'error');
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { load(); }, []);

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
                await deleteMenage(id);
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
                        <h2 className="text-xl md:text-2xl font-black text-slate-800">Liste des Ménages</h2>
                        <button 
                            onClick={() => navigate('/home/menage/add')} 
                            className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center shadow-lg transition-all"
                        >
                            <Plus size={20} className="mr-2" /> Ajouter
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
                    ) : (
                        <div className="grid gap-3">
                            <AnimatePresence>
                                {menages.map((m) => (
                                    <motion.div 
                                        key={m.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="bg-slate-50 p-3 md:p-4 rounded-2xl border border-slate-100 flex flex-wrap items-center justify-between gap-3 hover:border-indigo-200 transition-all"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600"><Home size={18} /></div>
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Région</p>
                                                <p className="text-sm md:text-base font-bold text-slate-800">{m.region}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => navigate(`/home/menage/detail/${m.id}`)} className="p-2.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"><Eye size={18}/></button>
                                            <button onClick={() => navigate(`/home/menage/edit/${m.id}`)} className="p-2.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"><Edit3 size={18}/></button>
                                            <button onClick={() => handleDelete(m.id)} className="p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"><Trash2 size={18}/></button>
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

export default MenageList;