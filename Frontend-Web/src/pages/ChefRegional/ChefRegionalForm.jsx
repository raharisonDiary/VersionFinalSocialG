import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faSpinner,faImage } from '@fortawesome/free-solid-svg-icons';
import chefService from '../../services/chefRegionalService';

const ChefRegionalForm = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        cin: '',
        adresse: '',
        whatsapp: '+261',
        email: ''
    });
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        if (formData.cin.length !== 12) {
            alert("Le CIN doit contenir exactement 12 chiffres.");
            return false;
        }
        if (!formData.whatsapp.startsWith("+261")) {
            alert("Le numéro WhatsApp doit commencer par +261.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        const data = new FormData();
        
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        
        if (file) {
            data.append('photo', file);
        }

        try {
            await chefService.create(data);
            alert("Chef régional enregistré avec succès !");
            setFormData({ nom: '', prenom: '', cin: '', adresse: '', whatsapp: '+261', email: '' });
            setFile(null);
        } catch {
            alert("Erreur lors de l'enregistrement du chef.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-2xl mx-auto p-4"
        >
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center px-8">
                    <h2 className="text-2xl font-bold text-white">Nouveau Chef Régional</h2>
                </div>

                <div className="p-6 md:p-8 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="relative">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nom</label>
                            <input required placeholder="Nom" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                        </div>
                        <div className="relative">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Prénom</label>
                            <input required placeholder="Prénom" value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                        </div>
                    </div>

                    <div className="relative">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">CIN (12 chiffres)</label>
                        <input required placeholder="000000000000" maxLength="12" value={formData.cin} onChange={e => setFormData({...formData, cin: e.target.value.replace(/\D/g, '')})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>

                    <div className="relative">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Adresse</label>
                        <input required placeholder="Adresse complète" value={formData.adresse} onChange={e => setFormData({...formData, adresse: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="relative">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">WhatsApp</label>
                            <input required placeholder="+261..." value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                        </div>
                        <div className="relative">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email</label>
                            <input required type="email" placeholder="email@exemple.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                        </div>
                    </div>

                    <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-indigo-400 transition-all">
                        <input type="file" onChange={e => setFile(e.target.files[0])} className="hidden" id="photoInput" />
                        <label htmlFor="photoInput" className="cursor-pointer text-slate-500 flex flex-col items-center">
                            <FontAwesomeIcon icon={faImage} size="2x" className="mb-2" />
                            {file ? file.name : "Cliquez pour choisir une photo"}
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
                    >
                        {isSubmitting ? (
                            <><FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Enregistrement...</>
                        ) : (
                            <><FontAwesomeIcon icon={faSave} className="mr-2" /> Enregistrer le Chef</>
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default ChefRegionalForm;