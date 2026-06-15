import { useState } from 'react';
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
            alert("Enregistré avec succès !");
            setFormData({ nom: '', prenom: '', cin: '', adresse: '', whatsapp: '+261', email: '' });
            setFile(null);
        } catch {
            alert("Erreur lors de l'enregistrement.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded bg-white">
            <input required placeholder="Nom" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className="block w-full mb-2 p-2 border" />
            <input required placeholder="Prenom" value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} className="block w-full mb-2 p-2 border" />
            <input required placeholder="CIN (12 chiffres)" maxLength="12" value={formData.cin} onChange={e => setFormData({...formData, cin: e.target.value.replace(/\D/g, '')})} className="block w-full mb-2 p-2 border" />
            <input required placeholder="Adresse" value={formData.adresse} onChange={e => setFormData({...formData, adresse: e.target.value})} className="block w-full mb-2 p-2 border" />
            <input required placeholder="WhatsApp" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="block w-full mb-2 p-2 border" />
            <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="block w-full mb-2 p-2 border" />
            <input type="file" onChange={e => setFile(e.target.files[0])} className="block w-full mb-4" />
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white p-2 rounded">
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </button>
        </form>
    );
};

export default ChefRegionalForm;