import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faPlus, faSpinner, faUsers } from '@fortawesome/free-solid-svg-icons';
import agentService from '../../services/agentService';

const AgentListe = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await agentService.getAll();
                setAgents(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error("Error fetching agents:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAgents();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this agent?")) {
            try {
                await agentService.delete(id);
                setAgents(agents.filter(a => a.id !== id));
            } catch  {
                alert("An error occurred while deleting the agent.");
            }
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-indigo-600" />
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto px-4 py-6">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between px-8">
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                        <FontAwesomeIcon icon={faUsers} /> Agent List
                    </h2>
                    <Link to="/home/agents/add" className="bg-white text-indigo-600 px-5 py-2 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                        <FontAwesomeIcon icon={faPlus} /> Add
                    </Link>
                </div>

                <div className="overflow-x-auto p-4 md:p-8">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                                <th className="p-4">Agent</th>
                                <th className="p-4 hidden md:table-cell">Email</th>
                                <th className="p-4 hidden md:table-cell">WhatsApp</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {agents.length > 0 ? agents.map((a) => (
                                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">{a.nom} {a.prenom}</div>
                                        <div className="text-xs text-slate-400">CIN: {a.cin}</div>
                                    </td>
                                    <td className="p-4 text-slate-600 hidden md:table-cell">{a.email}</td>
                                    <td className="p-4 text-slate-600 hidden md:table-cell">{a.whatsApp}</td>
                                    <td className="p-4 flex gap-2 justify-center">
                                        <Link to={`/home/agents/details/${a.id}`} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                                            <FontAwesomeIcon icon={faEye} />
                                        </Link>
                                        <Link to={`/home/agents/edit/${a.id}`} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Link>
                                        <button onClick={() => handleDelete(a.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="text-center p-8 text-slate-400">No agents found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default AgentListe;