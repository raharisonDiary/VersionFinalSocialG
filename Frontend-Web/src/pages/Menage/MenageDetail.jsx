import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit3, MapPin, Calendar, LayoutGrid, Loader2 } from 'lucide-react';
import { getMenageById } from '../../services/menageService';

const MenageDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [m, setM] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMenageById(id).then(res => {
            setM(res.data);
            setLoading(false);
        });
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="w-full max-w-2xl mx-auto px-2 md:px-4 py-6"
        >
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center px-4 md:px-6">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full font-bold transition-all text-sm"
                    >
                        <ArrowLeft size={16} className="mr-2" /> Retour
                    </button>
                </div>

                <div className="px-4 md:px-6 pb-8 -mt-6">
                    <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                        <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-6 flex items-center">
                            <LayoutGrid className="mr-2 text-indigo-600" /> Détails du Ménage
                        </h2>
                        
                        <div className="space-y-5">
                            {[
                                { label: 'Région', value: m.region },
                                { label: 'District', value: m.district },
                                { label: 'Commune', value: m.commune },
                                { label: 'Fokontany', value: m.fokontany },
                            ].map((item, idx) => (
                                <div key={idx} className="border-b border-slate-50 pb-2">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                                    <p className="font-bold text-slate-800 text-base md:text-lg">{item.value}</p>
                                </div>
                            ))}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase flex items-center mb-1">
                                        <MapPin size={10} className="mr-1" /> GPS
                                    </p>
                                    <p className="font-mono font-bold text-slate-700 text-xs md:text-sm truncate">{m.gpsCoordinates}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase flex items-center mb-1">
                                        <Calendar size={10} className="mr-1" /> Création
                                    </p>
                                    <p className="font-bold text-slate-700 text-xs md:text-sm">{new Date(m.dateCreation).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button 
                            className="w-full sm:w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-2xl font-bold transition-all" 
                            onClick={() => navigate('/home/menage/list')}
                        >
                            Liste
                        </button>
                        <button 
                            className="w-full sm:w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all" 
                            onClick={() => navigate(`/home/menage/edit/${m.id}`)}
                        >
                            <Edit3 size={18} /> Modifier
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MenageDetail;