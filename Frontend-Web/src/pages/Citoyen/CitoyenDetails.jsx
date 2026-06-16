import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft, faEdit, faUser, faBriefcase, 
    faCalendar, faIdCard, faVenusMars, faUsers, faSpinner 
} from '@fortawesome/free-solid-svg-icons';
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
                alert("Une erreur est survenue lors du chargement des données.");
                setLoading(false);
            });
    }, [id]);

    const getImageUrl = (path) => {
        if (!path) return '';
        const fileName = path.split(/[\\/]/).pop();
        return `http://localhost:5296/uploads/${fileName}`;
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-indigo-600" />
        </div>
    );

    if (!citoyen) return <div className="p-6 text-center">Citoyen introuvable.</div>;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="w-full max-w-2xl mx-auto px-4 py-6"
        >
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                {/* Header stylé */}
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center px-6">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full font-bold transition-all"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Retour
                    </button>
                </div>

                <div className="px-6 pb-8 -mt-12">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-indigo-100 flex items-center justify-center">
                            {citoyen.photoPath ? (
                                <img src={getImageUrl(citoyen.photoPath)} alt={citoyen.nom} className="w-full h-full object-cover" />
                            ) : (
                                <FontAwesomeIcon icon={faUser} size="3x" className="text-indigo-400" />
                            )}
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mt-4 uppercase">{citoyen.nom} {citoyen.prenom}</h2>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { icon: faIdCard, label: 'CIN', val: citoyen.cin },
                                { icon: faVenusMars, label: 'Sexe', val: citoyen.sexe },
                                { icon: faCalendar, label: 'Date de naissance', val: citoyen.dateNaissance?.split('T')[0] },
                                { icon: faBriefcase, label: 'Profession', val: citoyen.profession },
                                { icon: faUsers, label: 'Situation Matrimoniale', val: citoyen.situationMatrimoniale },
                                { icon: faUsers, label: 'Nombre d\'enfants', val: citoyen.nombreEnfants },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center space-x-4">
                                    <div className="text-indigo-500 w-8 text-center"><FontAwesomeIcon icon={item.icon} /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                                        <p className="font-bold text-slate-700">{item.val}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={() => navigate('/home/citoyens/list')}
                            className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-xl font-bold transition-all"
                        >
                            Retour
                        </button>
                        <button 
                            onClick={() => navigate(`/home/citoyens/edit/${citoyen.id}`)}
                            className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold flex items-center justify-center shadow-lg transition-all"
                        >
                            <FontAwesomeIcon icon={faEdit} className="mr-2" /> Modifier
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CitoyenDetails;