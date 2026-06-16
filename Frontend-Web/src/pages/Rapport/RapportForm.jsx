import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, MapPin, Clipboard, FileText, Hash, Building2 } from 'lucide-react';
import rapportService from '../../services/rapportService';

const InputField = ({ icon: Icon, ...props }) => (
    <div className="relative">
        <div className="absolute left-4 top-3.5 text-slate-400"><Icon size={18} /></div>
        <input 
            {...props} 
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
        />
    </div>
);

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

const RapportForm = () => {
    const [data, setData] = useState({
        chefNom: '', chefPrenom: '', chefCin: '', region: '',
        nombreAgents: '', districts: '', communes: '', fokontany: '',
        subject: '', message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await rapportService.send(data);
            alert("Rapport envoyé avec succès.");
            setData({
                chefNom: '', chefPrenom: '', chefCin: '', region: '',
                nombreAgents: '', districts: '', communes: '', fokontany: '',
                subject: '', message: ''
            });
        } catch {
            alert("Erreur lors de l'envoi.");
        }
    };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-4 md:p-8 max-w-4xl mx-auto"
        >
            <motion.div variants={itemVariants} className="mb-8 p-8 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl shadow-lg text-white">
                <h2 className="text-3xl font-black">Nouveau Rapport</h2>
                <p className="text-indigo-100 opacity-90">Remplissez les informations ci-dessous</p>
            </motion.div>

            <motion.form variants={itemVariants} onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <InputField icon={User} placeholder="Nom" onChange={e => setData({...data, chefNom: e.target.value})} value={data.chefNom} required />
                    <InputField icon={User} placeholder="Prénom" onChange={e => setData({...data, chefPrenom: e.target.value})} value={data.chefPrenom} required />
                    <InputField icon={Hash} placeholder="CIN" onChange={e => setData({...data, chefCin: e.target.value})} value={data.chefCin} required />
                    <InputField icon={MapPin} placeholder="Région" onChange={e => setData({...data, region: e.target.value})} value={data.region} required />
                    <InputField icon={Building2} type="number" placeholder="Nombre d'agents" onChange={e => setData({...data, nombreAgents: e.target.value})} value={data.nombreAgents} required />
                    <InputField icon={MapPin} placeholder="Districts" onChange={e => setData({...data, districts: e.target.value})} value={data.districts} required />
                    <InputField icon={MapPin} placeholder="Communes" onChange={e => setData({...data, communes: e.target.value})} value={data.communes} required />
                    <InputField icon={MapPin} placeholder="Fokontany" onChange={e => setData({...data, fokontany: e.target.value})} value={data.fokontany} required />
                </div>

                <div className="space-y-6 mb-8">
                    <InputField icon={Clipboard} placeholder="Sujet du rapport" onChange={e => setData({...data, subject: e.target.value})} value={data.subject} required />
                    <div className="relative">
                        <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
                        <textarea 
                            placeholder="Message..." 
                            className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all h-32"
                            onChange={e => setData({...data, message: e.target.value})}
                            value={data.message}
                            required
                        />
                    </div>
                </div>

                <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/30"
                >
                    <Send size={18} /> Envoyer le rapport
                </motion.button>
            </motion.form>
        </motion.div>
    );
};

export default RapportForm;