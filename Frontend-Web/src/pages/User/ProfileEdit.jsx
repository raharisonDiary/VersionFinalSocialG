import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Save, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../services/api';

const ProfileEdit = () => {
    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/User/profile').then(res => setUser(res.data));
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpdate = async () => {
        try {
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                await api.post('/User/upload-photo', formData);
            }
            await api.put('/User/profile', user);
            Swal.fire({
                title: 'Succès',
                text: 'Profil mis à jour avec succès',
                icon: 'success',
                confirmButtonColor: '#4f46e5'
            }).then(() => navigate('/home/profile'));
        } catch {
            Swal.fire('Erreur', 'Impossible de mettre à jour le profil', 'error');
        }
    };

    if (!user) return <div className="text-center p-10 text-slate-500">Chargement...</div>;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto px-4 py-6"
        >
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100">
                <button 
                    onClick={() => navigate(-1)} 
                    className="mb-6 flex items-center text-slate-500 hover:text-indigo-600 font-bold transition-colors"
                >
                    <ArrowLeft size={18} className="mr-2" /> Retour
                </button>

                <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-8">Modifier le profil</h2>
                
                <div className="mb-8 text-center">
                    <div className="relative w-28 h-28 md:w-32 md:h-32 mx-auto group">
                        <img 
                            src={preview || (user.photoPath ? `http://localhost:5296/uploads/${user.photoPath}` : '/default-avatar.png')} 
                            className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-indigo-100 shadow-md"
                            alt="Preview"
                        />
                        <label className="absolute bottom-0 right-0 bg-indigo-600 p-2.5 rounded-full cursor-pointer hover:bg-indigo-700 transition shadow-lg">
                            <Camera size={18} className="text-white" />
                            <input type="file" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>
                </div>

                <div className="space-y-5">
                    {[
                        { label: 'Nom', key: 'nom' },
                        { label: 'Prénom', key: 'prenom' },
                        { label: 'CIN', key: 'cin' },
                        { label: 'Email', key: 'email' },
                        { label: 'WhatsApp', key: 'whatsApp' },
                        { label: 'Toerana', key: 'toerana' },
                    ].map((field) => (
                        <div key={field.key} className="w-full">
                            <label className="text-[10px] md:text-[11px] font-bold uppercase text-slate-400 ml-1 tracking-wider">{field.label}</label>
                            <input 
                                value={user[field.key] || ''} 
                                className="w-full p-3.5 md:p-4 mt-1 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm md:text-base" 
                                onChange={e => setUser({...user, [field.key]: e.target.value})} 
                            />
                        </div>
                    ))}
                </div>

                <motion.button 
                    whileHover={{ scale: 1.01, backgroundPosition: "100% 0%" }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleUpdate} 
                    style={{ 
                        backgroundImage: "linear-gradient(90deg, #4f46e5, #9333ea, #4f46e5)",
                        backgroundSize: "200% 100%"
                    }}
                    className="mt-10 w-full text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center space-x-2 transition-all duration-500 text-sm md:text-base"
                >
                    <Save size={20} />
                    <span>ENREGISTRER LES MODIFICATIONS</span>
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ProfileEdit;