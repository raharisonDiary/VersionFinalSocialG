import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCitoyenById } from '../../services/citoyenService';

const CitoyenDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [citoyen, setCitoyen] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCitoyenById(id)
            .then(res => {
                setCitoyen(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="p-6">Chargement...</div>;
    if (!citoyen) return <div className="p-6">Citoyen introuvable.</div>;

    return (
        <div className="p-6 bg-white shadow rounded max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700">Détails du Citoyen</h2>
            
            <div className="flex flex-col items-center mb-6">
                {citoyen.photoPath && (
                    <img 
                        src={`http://localhost:5296${citoyen.photoPath}`} 
                        alt={citoyen.nom} 
                        className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
                    />
                )}
                <h3 className="text-xl font-semibold mt-4">{citoyen.nom} {citoyen.prenom}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-gray-700">
                <p><strong>CIN:</strong> {citoyen.cin}</p>
                <p><strong>Sexe:</strong> {citoyen.sexe}</p>
                <p><strong>Date de naissance:</strong> {citoyen.dateNaissance?.split('T')[0]}</p>
                <p><strong>Profession:</strong> {citoyen.profession}</p>
                <p><strong>Situation Matrimoniale:</strong> {citoyen.situationMatrimoniale}</p>
                <p><strong>Nombre d'enfants:</strong> {citoyen.nombreEnfants}</p>
            </div>

            <div className="mt-8 flex space-x-4">
                <button 
                    onClick={() => navigate('/home/citoyens/list')}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Retour à la liste
                </button>
            </div>
        </div>
    );
};

export default CitoyenDetails;