import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMenageById } from '../../services/menageService';

const MenageDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [m, setM] = useState(null);

    useEffect(() => {
        getMenageById(id).then(res => setM(res.data));
    }, [id]);

    if (!m) return <div className="p-8 text-center">Chargement des données...</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-2xl mx-auto bg-white p-8 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-6 border-b pb-2">Détail du Ménage</h2>
                
                <div className="space-y-4 text-lg">
                    <p><span className="font-semibold text-gray-700">Région :</span> {m.region}</p>
                    <p><span className="font-semibold text-gray-700">District :</span> {m.district}</p>
                    <p><span className="font-semibold text-gray-700">Commune :</span> {m.commune}</p>
                    <p><span className="font-semibold text-gray-700">Fokontany :</span> {m.fokontany}</p>
                    <p><span className="font-semibold text-gray-700">Coordonnées GPS :</span> {m.gpsCoordinates}</p>
                    <p><span className="font-semibold text-gray-700">Date de création :</span> {new Date(m.dateCreation).toLocaleDateString()}</p>
                </div>

                <div className="mt-8 flex gap-4">
                    <button 
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded transition" 
                        onClick={() => navigate('/home/menage/list')}
                    >
                        Retour à la liste
                    </button>
                    <button 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition" 
                        onClick={() => navigate(`/home/menage/edit/${m.id}`)}
                    >
                        Modifier
                    </button>
                </div>
            </div>
        </div>
    );
};
export default MenageDetail;