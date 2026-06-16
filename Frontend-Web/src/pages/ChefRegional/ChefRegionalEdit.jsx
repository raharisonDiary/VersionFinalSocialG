import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import chefService from '../../services/chefRegionalService';

const ChefRegionalEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        cin: '',
        adresse: '',
        whatsapp: '',
        email: ''
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        chefService.getById(id).then(res => {
            if (res.data) {
                setFormData({
                    nom: res.data.nom || '',
                    prenom: res.data.prenom || '',
                    cin: res.data.cin || '',
                    adresse: res.data.adresse || '',
                    whatsapp: res.data.whatsapp || '',
                    email: res.data.email || ''
                });
            }
            setLoading(false);
        }).catch(() => {
            alert("Erreur lors du chargement des données.");
            setLoading(false);
        });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const data = new FormData();
        
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        
        if (file) {
            data.append('photo', file);
        }

        try {
            await chefService.update(id, data);
            alert("Modification réussie !");
            navigate('/home/chefs/list');
        } catch {
            alert("Erreur lors de la modification.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center px-4 md:px-6">
                    <button 
                        type="button"
                        onClick={() => navigate(-1)} 
                        className="flex items-center text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full font-bold transition-all text-sm"
                    >
                        <ArrowLeft size={16} className="mr-2" /> Retour
                    </button>
                </div>

                <div className="px-4 md:px-6 pb-8 -mt-6">
                    <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
                        <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-6">Modifier le Chef</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nom</label>
                                <input required value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Prénom</label>
                                <input required value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">CIN (12 chiffres)</label>
                            <input required maxLength="12" value={formData.cin} onChange={e => setFormData({...formData, cin: e.target.value.replace(/\D/g, '')})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Adresse</label>
                            <input required value={formData.adresse} onChange={e => setFormData({...formData, adresse: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">WhatsApp</label>
                                <input required value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email</label>
                                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                            </div>
                        </div>

                        <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-indigo-400 transition-all">
                            <input type="file" onChange={e => setFile(e.target.files[0])} className="hidden" id="photoInput" />
                            <label htmlFor="photoInput" className="cursor-pointer text-slate-500 flex flex-col items-center">
                                <ImageIcon size={24} className="mb-2" />
                                {file ? file.name : "Changer la photo (optionnel)"}
                            </label>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Enregistrer les modifications</>}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default ChefRegionalEdit;