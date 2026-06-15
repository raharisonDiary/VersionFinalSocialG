import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createMenage, updateMenage, getMenageById } from '../../services/menageService';

const MenageForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ region: '', district: '', commune: '', fokontany: '', gpsCoordinates: '' });

    useEffect(() => {
        if (id) getMenageById(id).then(res => setForm(res.data));
    }, [id]);

    const handleGetGPS = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setForm({ ...form, gpsCoordinates: `${pos.coords.latitude}, ${pos.coords.longitude}` });
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) await updateMenage(id, form);
            else await createMenage(form);
            navigate('/home/menage/list');
        } catch (error) {
            console.error("Erreur lors de l'enregistrement:", error);
            alert("Erreur: Vérifiez votre connexion ou le serveur.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded space-y-4">
            <h2 className="text-xl font-bold">{id ? "Modifier" : "Ajouter"} un Ménage</h2>
            
            <input placeholder="Région" className="w-full p-2 border" value={form.region} onChange={e => setForm({...form, region: e.target.value})} />
            <input placeholder="District" className="w-full p-2 border" value={form.district} onChange={e => setForm({...form, district: e.target.value})} />
            <input placeholder="Commune" className="w-full p-2 border" value={form.commune} onChange={e => setForm({...form, commune: e.target.value})} />
            <input placeholder="Fokontany" className="w-full p-2 border" value={form.fokontany} onChange={e => setForm({...form, fokontany: e.target.value})} />
            
            <div className="flex gap-2">
                <input readOnly placeholder="GPS" className="flex-1 p-2 border" value={form.gpsCoordinates} />
                <button type="button" onClick={handleGetGPS} className="bg-green-600 text-white p-2">Capturer</button>
            </div>

            <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-indigo-600 text-white p-2">Enregistrer</button>
                <button 
                    type="button" 
                    onClick={() => navigate('/home/menage/list')} 
                    className="flex-1 bg-gray-500 text-white p-2"
                >
                    Retour
                </button>
            </div>
        </form>
    );
};

export default MenageForm;