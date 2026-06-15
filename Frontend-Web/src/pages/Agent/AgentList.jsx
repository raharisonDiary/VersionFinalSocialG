import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import agentService from '../../services/agentService';

const AgentListe = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await agentService.getAll();
                setAgents(Array.isArray(response.data) ? response.data : []);
            } catch {
                alert("Erreur lors du chargement.");
            } finally {
                setLoading(false);
            }
        };
        fetchAgents();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer cet agent ?")) {
            try {
                await agentService.delete(id);
                setAgents(agents.filter(a => a.id !== id));
            } catch {
                alert("Erreur lors de la suppression.");
            }
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Liste des Agents</h2>
            {loading ? (
                <p>Chargement en cours...</p>
            ) : (
                <table className="w-full border-collapse border bg-white shadow-sm">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Nom</th>
                            <th className="border p-2">Prenom</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">WhatsApp</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agents.map((a) => (
                            <tr key={a.id} className="hover:bg-gray-50">
                                <td className="border p-2">{a.nom}</td>
                                <td className="border p-2">{a.prenom}</td>
                                <td className="border p-2">{a.email}</td>
                                <td className="border p-2">{a.whatsApp}</td>
                                <td className="border p-2 flex gap-2 justify-center">
                                    <Link to={`/home/agents/details/${a.id}`} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">Détails</Link>
                                    <Link to={`/home/agents/edit/${a.id}`} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">Modifier</Link>
                                    <button onClick={() => handleDelete(a.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AgentListe;