import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import agentService from '../../services/agentService';

const AgentEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nom: '', prenom: '', cin: '', adresse: '', whatsapp: '', email: ''
    });
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        const fetchAgent = async () => {
            try {
                const res = await agentService.getById(id);
                const data = res.data;
                setFormData({
                    nom: data.nom || '',
                    prenom: data.prenom || '',
                    cin: data.cin || '',
                    adresse: data.adresse || data.toerana || '',
                    whatsapp: data.whatsapp || data.whatsApp || '',
                    email: data.email || ''
                });
                if (data.photoPath) {
                    setPreviewUrl(`http://localhost:5296/${data.photoPath}`);
                }
            } catch (error) {
                console.error("Erreur:", error);
                alert("Erreur lors du chargement.");
            } finally {
                setLoading(false);
            }
        };
        fetchAgent();
    }, [id]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        data.append('Nom', formData.nom);
        data.append('Prenom', formData.prenom);
        data.append('CIN', formData.cin);
        data.append('Toerana', formData.adresse);
        data.append('WhatsApp', formData.whatsapp);
        data.append('Email', formData.email);
        data.append('Role', 'Agent');

        if (file) data.append('Photo', file);

        try {
            await agentService.update(id, data);
            alert("Modification réussie !");
            navigate('/home/agents/list');
        } catch (error) {
            console.error("Erreur:", error);
            alert("Erreur lors de la mise à jour.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="p-6 text-center">Chargement...</div>;

    return (
        <form onSubmit={handleSubmit} className="p-6 border rounded-xl bg-white shadow-lg max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-6">Modifier l'Agent</h2>
            
            <div className="mb-4 text-center">
                {previewUrl && (
                    <img src={previewUrl} alt="Profil" className="w-24 h-24 object-cover rounded-full mx-auto border" />
                )}
            </div>

            <input placeholder="Nom" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className="block w-full mb-2 p-2 border rounded" required />
            <input placeholder="Prenom" value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} className="block w-full mb-2 p-2 border rounded" required />
            <input placeholder="CIN" value={formData.cin} onChange={e => setFormData({...formData, cin: e.target.value})} className="block w-full mb-2 p-2 border rounded" required />
            <input placeholder="Adresse" value={formData.adresse} onChange={e => setFormData({...formData, adresse: e.target.value})} className="block w-full mb-2 p-2 border rounded" required />
            <input placeholder="WhatsApp" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="block w-full mb-2 p-2 border rounded" required />
            <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="block w-full mb-2 p-2 border rounded" required />
            
            <label className="block text-sm font-medium mb-1 mt-4">Changer la photo :</label>
            <input type="file" onChange={handleFileChange} className="block w-full mb-6" />
            
            <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition font-bold">
                {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
        </form>
    );
};

export default AgentEdit;