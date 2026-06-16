import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Loader2, Image as ImageIcon, QrCode, UserPlus } from 'lucide-react';
import agentService from '../../services/agentService';

const AgentForm = () => {
    const [formData, setFormData] = useState({
        nom: '', prenom: '', cin: '', adresse: '', whatsapp: '+261', email: ''
    });
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [agentId, setAgentId] = useState(null);

    // eslint-disable-next-line react-hooks/purity
    const timestamp = useMemo(() => Date.now(), [agentId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setAgentId(null);
        
        const data = new FormData();
        data.append('Nom', formData.nom);
        data.append('Prenom', formData.prenom);
        data.append('CIN', formData.cin);
        data.append('Toerana', formData.adresse);
        data.append('WhatsApp', formData.whatsapp);
        data.append('Email', formData.email);
        data.append('Password', 'Agent@2026');
        
        if (file) data.append('Photo', file);

        try {
            const response = await agentService.create(data);
            setAgentId(response.data.id);
            setFormData({ nom: '', prenom: '', cin: '', adresse: '', whatsapp: '+261', email: '' });
            setFile(null);
        } catch (error) {
            const message = error.response?.data?.message || "An error occurred during registration.";
            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto px-4 py-6">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center px-8">
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                        <UserPlus /> Add Agent
                    </h2>
                </div>

                <div className="p-6 md:p-8 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Name</label>
                            <input required value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Surname</label>
                            <input required value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">CIN</label>
                        <input required maxLength="12" value={formData.cin} onChange={e => setFormData({...formData, cin: e.target.value.replace(/\D/g, '')})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Address</label>
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
                            {file ? file.name : "Select photo"}
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                    >
                        {isSubmitting ? <><Loader2 className="animate-spin inline mr-2" /> Saving...</> : <><Save className="inline mr-2" size={20} /> Save Agent</>}
                    </button>
                </div>
            </form>

            <AnimatePresence>
                {agentId && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 p-6 border-2 border-dashed border-indigo-200 rounded-3xl bg-indigo-50 text-center">
                        <QrCode size={48} className="mx-auto text-indigo-600 mb-3" />
                        <h3 className="font-bold text-slate-800 text-lg mb-1">Agent QR Code</h3>
                        <img src={`${agentService.generateQrUrl(agentId)}?t=${timestamp}`} alt="QR" className="w-48 h-48 mx-auto border-4 border-white shadow-lg rounded-xl mt-4 object-contain" />
                        <p className="mt-4 text-sm text-slate-500">Capture this for agent login.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AgentForm;