import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCitoyens, deleteCitoyen } from '../../services/citoyenService';

const CitoyenList = () => {
    const [citoyens, setCitoyens] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getCitoyens(search);
                setCitoyens(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Erreur:", error);
            }
        };
        load();
    }, [search]);

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce citoyen ?")) {
            try {
                await deleteCitoyen(id);
                setCitoyens(citoyens.filter(c => c.id !== id));
            } catch (error) {
                console.error("Erreur suppression:", error);
            }
        }
    };

    return (
        <div className="p-6 bg-white shadow rounded">
            <div className="flex justify-between mb-4">
                <input 
                    placeholder="Rechercher par nom ou CIN..." 
                    className="p-2 border w-2/3"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button 
                    onClick={() => navigate('/home/citoyens/add')} 
                    className="bg-indigo-600 text-white p-2 rounded"
                >
                    + Ajouter
                </button>
            </div>

            <table className="w-full text-left">
                <thead>
                    <tr className="border-b">
                        <th className="p-2">Photo</th>
                        <th className="p-2">Nom</th>
                        <th className="p-2">Prénom</th>
                        <th className="p-2">CIN</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {citoyens.map(c => (
                        <tr key={c.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">
                                {c.photoPath ? (
                                    <img 
                                        src={`http://localhost:5296${c.photoPath}`}
                                        alt={c.nom} 
                                        className="w-12 h-12 rounded-full object-cover border"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://via.placeholder.com/150";
                                        }}
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-[10px] text-gray-500">
                                        No
                                    </div>
                                )}
                            </td>
                            <td className="p-2">{c.nom}</td>
                            <td className="p-2">{c.prenom}</td>
                            <td className="p-2">{c.cin}</td>
                            <td className="p-2 space-x-2">
                                {/* Bokotra Détails nampiana eto */}
                                <button 
                                    onClick={() => navigate(`/home/citoyens/details/${c.id}`)}
                                    className="text-green-600 hover:underline"
                                >
                                    Détails
                                </button>
                                
                                <button 
                                    onClick={() => navigate(`/home/citoyens/edit/${c.id}`)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Modifier
                                </button>
                                
                                <button 
                                    onClick={() => handleDelete(c.id)} 
                                    className="text-red-600 hover:underline"
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CitoyenList;