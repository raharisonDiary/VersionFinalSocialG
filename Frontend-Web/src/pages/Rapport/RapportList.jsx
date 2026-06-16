import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Eye, EyeOff, Info, Loader2 } from 'lucide-react';
import rapportService from '../../services/rapportService';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

const RapportList = () => {
    const [rapports, setRapports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        rapportService.getAll()
            .then(res => setRapports(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
        </div>
    );

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-4 md:p-8 max-w-5xl mx-auto"
        >
            {/* Header miaraka amin'ny gradient */}
            <motion.div variants={itemVariants} className="mb-8 p-6 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl shadow-lg">
                <h2 className="text-3xl font-black text-white">Liste des Rapports</h2>
                <p className="text-indigo-100 opacity-80">Suivi et gestion des rapports reçus</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-6 font-bold text-slate-400 uppercase text-xs tracking-wider">Chef</th>
                                <th className="p-6 font-bold text-slate-400 uppercase text-xs tracking-wider">Région</th>
                                <th className="p-6 font-bold text-slate-400 uppercase text-xs tracking-wider">Statut</th>
                                <th className="p-6 font-bold text-slate-400 uppercase text-xs tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {rapports.length > 0 ? (
                                rapports.map((r) => (
                                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-6 font-bold text-slate-700">{r.chefNom}</td>
                                        <td className="p-6 text-slate-600">{r.region}</td>
                                        <td className="p-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${r.isSeen ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {r.isSeen ? <Eye size={12} /> : <EyeOff size={12} />}
                                                {r.isSeen ? 'Vu' : 'Non vu'}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            {/* Bokotra misy animation */}
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                                                <Link 
                                                    to={`/home/rapport/details/${r.id}`} 
                                                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/30"
                                                >
                                                    <Info size={14} /> Détails
                                                </Link>
                                            </motion.div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-slate-400">
                                        <FileText size={48} className="mx-auto mb-4 opacity-20" />
                                        Aucun rapport disponible.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default RapportList;