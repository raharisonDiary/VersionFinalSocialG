import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import chefService from '../../services/chefRegionalService';

const ChefRegionalListe = () => {
    const [chefs, setChefs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChefs = async () => {
            try {
                const response = await chefService.getAll();
                setChefs(Array.isArray(response.data) ? response.data : []);
            } catch {
                alert("Erreur lors du chargement de la liste.");
            } finally {
                setLoading(false);
            }
        };
        fetchChefs();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce chef ?")) {
            try {
                await chefService.delete(id);
                setChefs(chefs.filter(c => (c.id || c.Id) !== id));
            } catch {
                alert("Erreur lors de la suppression.");
            }
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-indigo-600" />
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="w-full max-w-5xl mx-auto px-2 md:px-4 py-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-black text-slate-800">Chefs Régionaux</h2>
                <Link to="/home/chefs/add" className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 text-sm md:text-base">
                    <FontAwesomeIcon icon={faPlus} /> <span className="hidden md:inline">Ajouter</span>
                </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] md:text-xs font-bold">
                                <th className="p-4 md:p-5">Nom & Prénom</th>
                                <th className="p-4 md:p-5 hidden md:table-cell">Adresse</th>
                                <th className="p-4 md:p-5 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chefs.map((chef, index) => (
                                <motion.tr 
                                    key={chef.id || chef.Id || index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                                >
                                    <td className="p-4 md:p-5">
                                        <div className="font-bold text-slate-800 text-sm md:text-base">{chef.nom}</div>
                                        <div className="text-slate-500 text-xs md:text-sm">{chef.prenom}</div>
                                    </td>
                                    <td className="p-4 md:p-5 text-slate-600 text-sm hidden md:table-cell">{chef.adresse}</td>
                                    <td className="p-4 md:p-5 flex justify-center items-center gap-1 md:gap-2">
                                        <Link to={`/home/chefs/details/${chef.id || chef.Id}`} className="text-emerald-500 hover:bg-emerald-50 p-2 md:p-3 rounded-xl transition-all">
                                            <FontAwesomeIcon icon={faEye} />
                                        </Link>
                                        <Link to={`/home/chefs/edit/${chef.id || chef.Id}`} className="text-amber-500 hover:bg-amber-50 p-2 md:p-3 rounded-xl transition-all">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Link>
                                        <button onClick={() => handleDelete(chef.id || chef.Id)} className="text-rose-500 hover:bg-rose-50 p-2 md:p-3 rounded-xl transition-all">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {chefs.length === 0 && (
                        <div className="p-10 text-center text-slate-400">Aucun chef trouvé.</div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ChefRegionalListe;