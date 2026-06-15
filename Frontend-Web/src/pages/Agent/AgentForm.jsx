import { useState } from 'react';
import agentService from '../../services/agentService';

const AgentForm = () => {
    const [formData, setFormData] = useState({
        nom: '', prenom: '', cin: '', adresse: '', whatsapp: '+261', email: ''
    });
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [agentId, setAgentId] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setAgentId(null);
        
        const data = new FormData();
        data.append('Nom', formData.nom);
        data.append('Prenom', formData.prenom);
        data.append('CIN', formData.cin);
        data.append('Adresse', formData.adresse);
        data.append('WhatsApp', formData.whatsapp);
        data.append('Email', formData.email);
        data.append('Role', 'Agent');
        data.append('Toerana', formData.adresse);
        data.append('Password', 'Agent@2026');
        
        if (file) data.append('Photo', file);

        try {
            const response = await agentService.create(data);
            setAgentId(response.data.id);
            alert("Agent enregistré avec succès !");
            setFormData({ nom: '', prenom: '', cin: '', adresse: '', whatsapp: '+261', email: '' });
            setFile(null);
        } catch (error) {
            const message = error.response?.data?.message || error.response?.data || "Erreur lors de l'enregistrement.";
            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow-sm mb-6">
                <h2 className="text-xl font-bold mb-4">Ajouter un Agent</h2>
                <input required placeholder="Nom" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className="block w-full mb-2 p-2 border rounded" />
                <input required placeholder="Prenom" value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} className="block w-full mb-2 p-2 border rounded" />
                <input required placeholder="CIN (12 chiffres)" maxLength="12" value={formData.cin} onChange={e => setFormData({...formData, cin: e.target.value.replace(/\D/g, '')})} className="block w-full mb-2 p-2 border rounded" />
                <input required placeholder="Adresse" value={formData.adresse} onChange={e => setFormData({...formData, adresse: e.target.value})} className="block w-full mb-2 p-2 border rounded" />
                <input required placeholder="WhatsApp" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="block w-full mb-2 p-2 border rounded" />
                <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="block w-full mb-2 p-2 border rounded" />
                <label className="block text-sm font-medium mb-1">Photo de profil :</label>
                <input type="file" onChange={e => setFile(e.target.files[0])} className="block w-full mb-4" />
                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
                    {isSubmitting ? "Enregistrement en cours..." : "Enregistrer"}
                </button>
            </form>

            {agentId && (
                <div className="p-4 border rounded bg-white shadow-sm text-center">
                    <h3 className="font-bold mb-2">Code QR de l'Agent :</h3>
                    <img 
                        src={`http://localhost:5296/api/User/generate-qr/${agentId}`} 
                        alt="QR Code" 
                        className="w-48 h-48 mx-auto border shadow-sm p-2 bg-white" 
                    />
                    <p className="mt-2 text-xs text-gray-500">Capturez cette image pour le login</p>
                </div>
            )}
        </div>
    );
};

export default AgentForm;