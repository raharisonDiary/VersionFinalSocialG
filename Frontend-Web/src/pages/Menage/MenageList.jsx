import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMenages, deleteMenage } from '../../services/menageService';

const MenageList = () => {
    const [menages, setMenages] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();

    const load = async () => {
        const res = await getMenages();
        setMenages(res.data);
        setLoaded(true);
    };

    if (!loaded) load();

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce ménage ?")) {
            await deleteMenage(id);
            load();
        }
    };

    return (
        <div className="p-6 bg-white shadow rounded">
            <div className="flex justify-between mb-4">
                <button onClick={() => navigate('/home/menage')} className="bg-gray-500 text-white p-2">
                    Retour
                </button>
                <button onClick={() => navigate('/home/menage/add')} className="bg-indigo-600 text-white p-2">
                    + Ajouter un ménage
                </button>
            </div>

            <table className="w-full text-left">
                <thead>
                    <tr>
                        <th className="p-2">Région</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {menages.map(m => (
                        <tr key={m.id} className="border-t">
                            <td className="p-2">{m.region}</td>
                            <td className="p-2 space-x-2">
                                <button onClick={() => navigate(`/home/menage/detail/${m.id}`)} className="text-gray-700 underline">Détail</button>
                                <button onClick={() => navigate(`/home/menage/edit/${m.id}`)} className="text-blue-600 underline">Modifier</button>
                                <button onClick={() => handleDelete(m.id)} className="text-red-600 underline">Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default MenageList;