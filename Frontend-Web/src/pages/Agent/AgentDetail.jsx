import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import agentService from '../../services/agentService';

const AgentDetail = () => {
    const { id } = useParams();
    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgent = async () => {
            try {
                const response = await agentService.getById(id);
                setAgent(response.data);
            } catch (error) {
                console.error("Erreur:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAgent();
    }, [id]);

    if (loading) return <div className="p-4 text-center">Chargement...</div>;
    if (!agent) return <div className="p-4 text-center text-red-500">Agent introuvable.</div>;

    const getPhotoUrl = () => {
        if (!agent.photoPath) return null;
        if (agent.photoPath.startsWith('http')) return agent.photoPath;
        return `http://localhost:5296/${agent.photoPath.replace(/\\/g, '/')}`;
    };

    return (
        <div className="p-6 border rounded-xl bg-white shadow-xl max-w-lg mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Détails de l'Agent</h2>
            
            <div className="flex flex-col items-center mb-8">
                {agent.photoPath ? (
                    <img 
                        src={getPhotoUrl()} 
                        alt="Profil" 
                        className="w-32 h-32 object-cover rounded-full border-4 border-blue-100 shadow-md mb-4" 
                        onError={(e) => { e.target.style.display = 'none'; }} 
                    />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4 text-gray-500 text-xs">Pas de photo</div>
                )}
                <h3 className="text-xl font-semibold text-gray-900">{agent.nom || 'Inconnu'} {agent.prenom || ''}</h3>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3 mb-6">
                <p><strong>CIN:</strong> {agent.cin || 'Non renseigné'}</p>
                <p><strong>Email:</strong> {agent.email || 'Non renseigné'}</p>
                <p><strong>WhatsApp:</strong> {agent.whatsapp || agent.whatsApp || 'Non renseigné'}</p>
                <p><strong>Adresse:</strong> {agent.toerana || agent.adresse || 'Non renseignée'}</p>
            </div>

            {agent.id && (
                <div className="mt-4 border-t pt-6 text-center">
                    <p className="mb-3 font-semibold text-gray-700">Code QR de l'Agent</p>
                    <img 
                        src={`http://localhost:5296/api/User/generate-qr/${agent.id}`} 
                        alt="QR Code" 
                        className="w-48 h-48 mx-auto border shadow-sm p-2 bg-white" 
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>
            )}

            <div className="mt-8 text-center">
                <Link to="/home/agents/list" className="bg-gray-600 text-white px-8 py-2 rounded-lg hover:bg-gray-700 transition">
                    Retour à la liste
                </Link>
            </div>
        </div>
    );
};

export default AgentDetail;