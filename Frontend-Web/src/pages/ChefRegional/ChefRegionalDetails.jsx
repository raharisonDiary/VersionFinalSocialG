import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import chefService from '../../services/chefRegionalService';

const ChefRegionalDetail = () => {
    const { id } = useParams();
    const [chef, setChef] = useState(null);

    useEffect(() => {
        const fetchChef = async () => {
            try {
                const response = await chefService.getById(id);
                setChef(response.data);
            } catch {
                alert("Erreur lors du chargement des détails.");
            }
        };
        fetchChef();
    }, [id]);

    if (!chef) return <div className="p-4">Chargement des détails...</div>;

    return (
        <div className="p-4 border rounded shadow-md bg-white">
            <h2 className="text-xl font-bold mb-4">Détails du Chef</h2>
            
            {chef.photoPath && (
                <img 
                    src={`http://localhost:5296/${chef.photoPath}`} 
                    alt="Profil" 
                    className="w-32 h-32 mb-4 object-cover border" 
                />
            )}
            
            <div className="space-y-2">
                <p><strong>Nom:</strong> {chef.nom}</p>
                <p><strong>Prenom:</strong> {chef.prenom}</p>
                <p><strong>CIN:</strong> {chef.cin}</p>
                <p><strong>Adresse:</strong> {chef.adresse}</p>
                <p><strong>WhatsApp:</strong> {chef.whatsapp}</p>
                <p><strong>Email:</strong> {chef.email}</p>
            </div>

            {chef.qrCodePath && (
                <div className="mt-4">
                    <p><strong>QR Code:</strong></p>
                    <img 
                        src={`http://localhost:5296/${chef.qrCodePath}`} 
                        alt="QR Code" 
                        className="w-32 h-32 mt-2" 
                    />
                </div>
            )}

            <div className="mt-6">
                <Link to="/home/chefs/list" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
                    Retour
                </Link>
            </div>
        </div>
    );
};

export default ChefRegionalDetail;