import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Send, User, MapPin, FileText} from 'lucide-react';
import rapportService from '../../services/rapportService';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

const RapportDetails = () => {
    const { id } = useParams();
    const [r, setR] = useState(null);
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        rapportService.getAll()
            .then(res => {
                setR(res.data.find(item => item.id == id));
                rapportService.markAsSeen(id);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    const handleReply = async () => {
        if (!reply.trim()) return;
        await rapportService.reply(id, reply);
        alert("Réponse envoyée avec succès.");
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
        </div>
    );

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-4 md:p-8 max-w-4xl mx-auto"
        >
            <motion.div variants={itemVariants} className="mb-8 p-6 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl shadow-lg text-white">
                <h2 className="text-3xl font-black">{r.subject}</h2>
                <p className="text-indigo-100 opacity-90 mt-1">Détails complets du rapport</p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-700">
                        <User className="text-indigo-500" size={20} />
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase">Chef</p>
                            <p className="font-bold">{r.chefNom} {r.chefPrenom}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                        <MapPin className="text-indigo-500" size={20} />
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase">Région</p>
                            <p className="font-bold">{r.region}</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    {[
                        { label: 'Agents', value: r.nombreAgents },
                        { label: 'Districts', value: r.districts },
                        { label: 'Communes', value: r.communes },
                        { label: 'Fokontany', value: r.fokontany }
                    ].map((item, i) => (
                        <div key={i} className="bg-slate-50 p-3 rounded-xl">
                            <p className="text-slate-400 text-[10px] font-bold uppercase">{item.label}</p>
                            <p className="font-black text-slate-800">{item.value}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-6">
                <h3 className="flex items-center gap-2 font-bold text-slate-700 mb-4">
                    <FileText className="text-indigo-500" size={20} /> Message
                </h3>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl">{r.message}</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <textarea 
                    className="w-full p-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all mb-4" 
                    rows="4"
                    onChange={e => setReply(e.target.value)} 
                    placeholder="Écrivez votre réponse ici..." 
                />
                <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReply} 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/30"
                >
                    <Send size={18} /> Envoyer la réponse
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default RapportDetails;