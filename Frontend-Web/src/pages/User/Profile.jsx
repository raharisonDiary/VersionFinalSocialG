import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, CreditCard, Edit3 } from 'lucide-react';
import api from '../../services/api';

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/User/profile').then(res => setUser(res.data));
    }, []);

    if (!user) return (
        <div className="flex h-64 items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl mx-auto px-4 py-4"
        >
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="h-28 md:h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                
                <div className="px-4 md:px-8 pb-8">
                    <div className="relative -mt-12 md:-mt-16 mb-4 md:mb-6 flex justify-center">
                        <img 
                            src={user.photoPath ? `http://localhost:5296/uploads/${user.photoPath}` : '/default-avatar.png'} 
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                            alt="Profil"
                        />
                    </div>

                    <div className="text-center mb-6 md:mb-8">
                        <h2 className="text-xl md:text-3xl font-black text-slate-800 break-words">{user.nom} {user.prenom}</h2>
                        <p className="text-slate-500 uppercase tracking-widest text-[10px] md:text-sm mt-1">Mon Compte</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:gap-6">
                        {[
                            { icon: <CreditCard size={18} />, label: "CIN", value: user.cin },
                            { icon: <Mail size={18} />, label: "Email", value: user.email },
                            { icon: <Phone size={18} />, label: "WhatsApp", value: user.whatsApp },
                            { icon: <MapPin size={18} />, label: "Toerana", value: user.toerana },
                        ].map((item, index) => (
                            <div key={index} className="bg-slate-50 p-3 md:p-4 rounded-2xl border border-slate-100 flex items-center space-x-4">
                                <div className="text-indigo-600 bg-indigo-50 p-2 md:p-2.5 rounded-xl shrink-0">{item.icon}</div>
                                <div className="min-w-0">
                                    <p className="text-[9px] md:text-[10px] uppercase font-bold text-slate-400 tracking-wider">{item.label}</p>
                                    <p className="font-semibold text-slate-700 text-xs md:text-base truncate">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.01, backgroundPosition: "100% 0%" }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => navigate('/home/profile/edit')} 
                        style={{ 
                            backgroundImage: "linear-gradient(90deg, #4f46e5, #9333ea, #4f46e5)",
                            backgroundSize: "200% 100%"
                        }}
                        className="mt-8 w-full text-white py-3 md:py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center space-x-2 transition-all duration-500 text-sm md:text-base"
                    >
                        <Edit3 size={18} />
                        <span>MODIFIER LE PROFIL</span>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;