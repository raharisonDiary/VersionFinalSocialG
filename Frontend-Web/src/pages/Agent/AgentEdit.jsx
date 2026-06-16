import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, Loader2, UserPlus, MapPin, Mail, Phone, Fingerprint, QrCode } from 'lucide-react';
import agentService from '../../services/agentService';

const AgentEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // eslint-disable-next-line react-hooks/purity
    const qrTimestamp = useMemo(() => Date.now(), [id]);

    useEffect(() => {
        if (!id) return;
        
        const fetchAgent = async () => {
            try {
                const response = await agentService.getById(id);
                setFormData({
                    nom: response.data.nom,
                    prenom: response.data.prenom,
                    cin: response.data.cin,
                    adresse: response.data.toerana,
                    whatsapp: response.data.whatsApp,
                    email: response.data.email
                });
            } catch (err) {
                console.error("Error loading agent:", err);
                alert("Error: Unable to load agent data.");
            }
        };
        fetchAgent();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!id) return;
        
        setIsSubmitting(true);
        
        const data = new FormData();
        data.append('Nom', formData.nom || '');
        data.append('Prenom', formData.prenom || '');
        data.append('CIN', formData.cin || '');
        data.append('Toerana', formData.adresse || '');
        data.append('WhatsApp', formData.whatsapp || '');
        data.append('Email', formData.email || '');
        
        try {
            await agentService.update(id, data);
            alert("Update successful!");
            navigate('/home/agents/list');
        } catch (error) {
            console.error("Update error:", error);
            alert("An error occurred during update. Please check the fields.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!formData) return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto px-4 py-6">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center px-8">
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                        <UserPlus /> Edit Agent
                    </h2>
                </div>

                <div className="p-8 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Name</label>
                            <input value={formData.nom || ''} onChange={e => setFormData({...formData, nom: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Surname</label>
                            <input value={formData.prenom || ''} onChange={e => setFormData({...formData, prenom: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1"><Fingerprint size={12}/> CIN</label>
                        <input value={formData.cin || ''} onChange={e => setFormData({...formData, cin: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1"><MapPin size={12}/> Address</label>
                        <input value={formData.adresse || ''} onChange={e => setFormData({...formData, adresse: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1"><Phone size={12}/> WhatsApp</label>
                            <input value={formData.whatsapp || ''} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1"><Mail size={12}/> Email</label>
                            <input value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/20 transition-all"
                    >
                        {isSubmitting ? <><Loader2 className="animate-spin inline mr-2" /> Updating...</> : <><Save className="inline mr-2" size={20} /> Save Changes</>}
                    </button>

                    <div className="mt-8 p-6 border-2 border-dashed border-indigo-200 rounded-3xl bg-indigo-50 text-center">
                        <QrCode size={48} className="mx-auto text-indigo-600 mb-3" />
                        <h3 className="font-bold text-slate-800 text-lg mb-1">Agent QR Code</h3>
                        <img 
                            src={`${agentService.generateQrUrl(id)}?t=${qrTimestamp}`} 
                            alt="QR Code" 
                            className="w-48 h-48 mx-auto border-4 border-white shadow-lg rounded-xl mt-4" 
                        />
                        <p className="mt-4 text-sm text-slate-500">Capture this for agent login.</p>
                    </div>
                </div>
            </form>
        </motion.div>
    );
};

export default AgentEdit;