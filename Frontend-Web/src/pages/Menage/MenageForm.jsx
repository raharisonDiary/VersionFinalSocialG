import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Loader2, Navigation } from 'lucide-react';
import Swal from 'sweetalert2';
import { createMenage, updateMenage, getMenageById } from '../../services/menageService';

const MenageForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ region: '', district: '', commune: '', fokontany: '', gpsCoordinates: '' });

    useEffect(() => {
        if (id) getMenageById(id).then(res => setForm(res.data));
    }, [id]);

    const handleGetGPS = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setForm({ ...form, gpsCoordinates: `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}` });
        }, () => {
            Swal.fire('Erreur', 'Impossible de récupérer la position GPS', 'error');
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) await updateMenage(id, form);
            else await createMenage(form);
            
            Swal.fire({
                title: 'Succès',
                text: id ? 'Ménage mis à jour avec succès' : 'Ménage enregistré avec succès',
                icon: 'success',
                confirmButtonColor: '#4f46e5'
            }).then(() => navigate('/home/menage/list'));
        } catch {
            Swal.fire('Erreur', 'Veuillez vérifier votre connexion', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto px-4 py-6"
        >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="h-28 md:h-32 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center px-6 md:px-8">
                    <button 
                        type="button" 
                        onClick={() => navigate(-1)} 
                        className="flex items-center text-indigo-950 bg-white/60 hover:bg-white p-2.5 rounded-full font-bold transition-all shadow"
                    >
                        <ArrowLeft size={18} className="mr-2" /> Retour
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="px-4 md:px-8 pb-8 -mt-6">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-8 bg-white/90 p-2 rounded-xl inline-block">
                        {id ? "Modifier le Ménage" : "Ajouter un Ménage"}
                    </h2>
                    
                    <div className="space-y-4">
                        {[
                            { label: 'Région', key: 'region' },
                            { label: 'District', key: 'district' },
                            { label: 'Commune', key: 'commune' },
                            { label: 'Fokontany', key: 'fokontany' },
                        ].map((field) => (
                            <div key={field.key}>
                                <label className="block text-[10px] md:text-[11px] font-bold uppercase text-slate-400 ml-1 mb-1 tracking-wider">{field.label}</label>
                                <input 
                                    required
                                    placeholder={field.label}
                                    className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm md:text-base text-slate-700 font-medium" 
                                    value={form[field.key]} 
                                    onChange={e => setForm({...form, [field.key]: e.target.value})} 
                                />
                            </div>
                        ))}

                        <div>
                            <label className="block text-[10px] md:text-[11px] font-bold uppercase text-slate-400 ml-1 mb-1 tracking-wider">Coordonnées GPS</label>
                            <div className="flex gap-2">
                                <input 
                                    readOnly 
                                    placeholder="Cliquez sur Capturer..." 
                                    className="flex-1 p-3 md:p-4 bg-slate-100 border border-slate-200 rounded-2xl text-sm md:text-base text-slate-600" 
                                    value={form.gpsCoordinates} 
                                />
                                <motion.button 
                                    whileHover={{ scale: 1.05, backgroundPosition: "100% 0%" }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button" 
                                    onClick={handleGetGPS} 
                                    style={{ 
                                        backgroundImage: "linear-gradient(90deg, #059669, #10b981, #059669)",
                                        backgroundSize: "200% 100%"
                                    }}
                                    className="text-white p-4 rounded-2xl shadow-lg transition-all duration-500"
                                >
                                    <Navigation size={20} />
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.01, backgroundPosition: "100% 0%" }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={loading}
                        style={{ 
                            backgroundImage: "linear-gradient(90deg, #4f46e5, #9333ea, #4f46e5)",
                            backgroundSize: "200% 100%"
                        }}
                        className="mt-8 w-full text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center space-x-2 transition-all duration-500"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> <span>ENREGISTRER LES INFORMATIONS</span></>}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
};

export default MenageForm;