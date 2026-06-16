import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Users, Home as HomeIcon, PieChart, ClipboardList, 
    Send, UserPlus, ShieldCheck, LogOut, Menu, ChevronRight, LayoutDashboard 
} from 'lucide-react';
import api from '../services/api';

const Home = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);

    useEffect(() => {
        api.get('/User/profile').then(res => setUser(res.data));
        const handleResize = () => {
            if (window.innerWidth >= 768) setIsOpen(true);
            else setIsOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-slate-100 overflow-hidden relative">
            <AnimatePresence>
                {isOpen && window.innerWidth < 768 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40"
                    />
                )}
            </AnimatePresence>

            <motion.aside 
                initial={false}
                animate={{ 
                    width: isOpen ? 280 : 80,
                    x: window.innerWidth < 768 && !isOpen ? -280 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-slate-950 text-white flex flex-col shadow-2xl z-50 h-full absolute md:relative overflow-hidden"
            >
                <div className="p-6 border-b border-white/10 flex flex-col items-center justify-center shrink-0">
                    <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-lg shrink-0">
                        {user?.nom?.charAt(0) || 'S'}
                    </div>
                    {isOpen && <div className="mt-4 font-black tracking-widest text-sm text-center">SOCIALGASY</div>}
                </div>

                <nav className="flex-1 p-2 space-y-2 overflow-y-auto">
                    <Link to="/home" className="flex items-center p-3 hover:bg-white/10 rounded-xl transition-all">
                        <LayoutDashboard size={20} className="shrink-0" /> {isOpen && <span className="ml-4">Accueil</span>}
                    </Link>
                    <Link to="/home/profile" className="flex items-center p-3 hover:bg-white/10 rounded-xl transition-all">
                        <User size={20} className="shrink-0" /> {isOpen && <span className="ml-4">Profil</span>}
                    </Link>
                    <Link to="/home/citoyens/list" className="flex items-center p-3 hover:bg-white/10 rounded-xl transition-all">
                        <Users size={20} className="shrink-0" /> {isOpen && <span className="ml-4">Citoyens</span>}
                    </Link>
                    <Link to="/home/menage" className="flex items-center p-3 hover:bg-white/10 rounded-xl transition-all">
                        <HomeIcon size={20} className="shrink-0" /> {isOpen && <span className="ml-4">Ménages</span>}
                    </Link>
                    <Link to="/home/statistiques" className="flex items-center p-3 hover:bg-white/10 rounded-xl transition-all">
                        <PieChart size={20} className="shrink-0" /> {isOpen && <span className="ml-4">Statistiques</span>}
                    </Link>

                    {role === 'Admin' && (
                        <Link to="/home/rapport/list" className="flex items-center p-3 hover:bg-white/10 rounded-xl transition-all">
                            <ClipboardList size={20} className="shrink-0" /> {isOpen && <span className="ml-4">Rapports</span>}
                        </Link>
                    )}

                    {role === 'ChefRegional' && (
                        <Link to="/home/rapport/send" className="flex items-center p-3 hover:bg-white/10 rounded-xl transition-all">
                            <Send size={20} className="shrink-0" /> {isOpen && <span className="ml-4">Envoyer Rapport</span>}
                        </Link>
                    )}

                    {role === 'Admin' && (
                        <div className="pt-2 border-t border-white/10">
                            {isOpen && <div className="text-[10px] text-slate-400 font-bold uppercase px-3 mb-2 mt-2">Chefs</div>}
                            <Link to="/home/chefs/list" className="flex items-center p-3 hover:bg-white/10 rounded-xl transition-all"><ChevronRight size={20} className="shrink-0" /> {isOpen && <span className="ml-4">Liste Chefs</span>}</Link>
                            <Link to="/home/chefs/add" className="flex items-center p-3 hover:bg-white/10 rounded-xl transition-all"><UserPlus size={20} className="shrink-0" /> {isOpen && <span className="ml-4">Ajouter Chef</span>}</Link>
                        </div>
                    )}

                    {(role === 'Admin' || role === 'ChefRegional') && (
                        <div className="pt-2 border-t border-white/10">
                            {isOpen && <div className="text-[10px] text-slate-400 font-bold uppercase px-3 mb-2 mt-2">Agents</div>}
                            <Link to="/home/agents/list" className="flex items-center p-3 hover:bg-white/10 rounded-xl transition-all"><ShieldCheck size={20} className="shrink-0" /> {isOpen && <span className="ml-4">Liste Agents</span>}</Link>
                            <Link to="/home/agents/add" className="flex items-center p-3 hover:bg-white/10 rounded-xl transition-all"><UserPlus size={20} className="shrink-0" /> {isOpen && <span className="ml-4">Ajouter Agent</span>}</Link>
                        </div>
                    )}
                </nav>

                <button onClick={handleLogout} className="m-4 p-3 bg-red-600/20 hover:bg-red-600 rounded-xl transition-all flex items-center justify-center border border-red-600/50">
                    <LogOut size={20} className="shrink-0" /> {isOpen && <span className="ml-3 font-bold">DÉCONNEXION</span>}
                </button>
            </motion.aside>

            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="h-16 bg-white shadow-sm flex items-center px-4 border-b">
                    <button className="text-slate-900 hover:text-indigo-600 transition-colors" onClick={() => setIsOpen(!isOpen)}>
                        <Menu size={24} />
                    </button>
                </header>
                <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Home;