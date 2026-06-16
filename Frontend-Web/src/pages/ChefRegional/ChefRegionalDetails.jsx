import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Edit3, Mail, Smartphone, IdCard, MapPin, QrCode, Loader2, X } from 'lucide-react';
import chefService from '../../services/chefRegionalService';

const ChefRegionalDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [c, setC] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isQrOpen, setIsQrOpen] = useState(false); // State ho an'ny modal

    useEffect(() => {
        chefService.getById(id).then(res => {
            setC(res.data);
            setLoading(false);
        }).catch(() => {
            alert("Erreur lors du chargement des détails.");
            setLoading(false);
        });
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
        </div>
    );

    if (!c) return <div className="p-6 text-center text-slate-500">Chef introuvable.</div>;

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
                        <div className="flex flex-col items-center mb-6">
                            {c.photoPath && (
                                <img 
                                    src={`http://localhost:5296/${c.photoPath}`} 
                                    alt="Profil" 
                                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg mb-4" 
                                />
                            )}
                            <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase">{c.nom} {c.prenom}</h2>
                        </div>
                        
                        <div className="space-y-5">
                            {[
                                { label: 'CIN', value: c.cin, icon: <IdCard size={14} /> },
                                { label: 'Adresse', value: c.adresse, icon: <MapPin size={14} /> },
                                { label: 'WhatsApp', value: c.whatsapp, icon: <Smartphone size={14} /> },
                                { label: 'Email', value: c.email, icon: <Mail size={14} /> },
                            ].map((item, idx) => (
                                <div key={idx} className="border-b border-slate-50 pb-2">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center mb-1">
                                        {item.icon} <span className="ml-1">{item.label}</span>
                                    </p>
                                    <p className="font-bold text-slate-800 text-base md:text-lg">{item.value}</p>
                                </div>
                            ))}

                            {c.qrCodePath && (
                                <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-all" onClick={() => setIsQrOpen(true)}>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase flex items-center mb-1">
                                            <QrCode size={12} className="mr-1" /> QR Code
                                        </p>
                                        <p className="text-xs text-slate-600">Cliquez pour agrandir</p>
                                    </div>
                                    <img src={`http://localhost:5296/${c.qrCodePath}`} alt="QR Code" className="w-16 h-16 border bg-white p-1 rounded-lg" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button className="w-full sm:w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-2xl font-bold transition-all" onClick={() => navigate('/home/chefs/list')}>Liste</button>
                        <button className="w-full sm:w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all" onClick={() => navigate(`/home/chefs/edit/${c.id}`)}>
                            <Edit3 size={18} /> Modifier
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal ho an'ny QR Code */}
            <AnimatePresence>
                {isQrOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                        onClick={() => setIsQrOpen(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                            className="bg-white p-4 rounded-3xl shadow-2xl relative"
                        >
                            <button className="absolute -top-4 -right-4 bg-white p-2 rounded-full shadow-lg text-slate-600" onClick={() => setIsQrOpen(false)}>
                                <X size={20} />
                            </button>
                            <img src={`http://localhost:5296/${c.qrCodePath}`} alt="QR Code Large" className="w-80 h-80" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ChefRegionalDetail;