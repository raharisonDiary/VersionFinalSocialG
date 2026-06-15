import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

    useEffect(() => {
        const fetchChef = async () => {
            try {
                const response = await chefService.getById(id);
                if (response.data) {
                    setFormData({
                        nom: response.data.nom || '',
                        prenom: response.data.prenom || '',
                        cin: response.data.cin || '',
                        adresse: response.data.adresse || '',
                        whatsapp: response.data.whatsapp || '',
                        email: response.data.email || ''
                    });
                }
            } catch {
                alert("Erreur lors du chargement des données.");
            }
        };
        fetchChef();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow-sm">
            <h2 className="text-xl font-bold mb-4">Modifier le Chef</h2>
            
            <label className="block text-sm font-medium">Nom</label>
            <input required placeholder="Nom" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className="block w-full mb-2 p-2 border rounded" />
            
            <label className="block text-sm font-medium">Prénom</label>
            <input required placeholder="Prenom" value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} className="block w-full mb-2 p-2 border rounded" />
            
            <label className="block text-sm font-medium">CIN</label>
            <input required placeholder="CIN" maxLength="12" value={formData.cin} onChange={e => setFormData({...formData, cin: e.target.value.replace(/\D/g, '')})} className="block w-full mb-2 p-2 border rounded" />
            
            <label className="block text-sm font-medium">Adresse</label>
            <input required placeholder="Adresse" value={formData.adresse} onChange={e => setFormData({...formData, adresse: e.target.value})} className="block w-full mb-2 p-2 border rounded" />
            
            <label className="block text-sm font-medium">WhatsApp</label>
            <input required placeholder="WhatsApp" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="block w-full mb-2 p-2 border rounded" />
            
            <label className="block text-sm font-medium">Email</label>
            <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="block w-full mb-2 p-2 border rounded" />
            
            <label className="block text-sm font-medium">Nouvelle photo (optionnel)</label>
            <input type="file" onChange={e => setFile(e.target.files[0])} className="block w-full mb-4" />
            
            <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition">
                Enregistrer les modifications
            </button>
        </form>
    );
};

export default ChefRegionalEdit;