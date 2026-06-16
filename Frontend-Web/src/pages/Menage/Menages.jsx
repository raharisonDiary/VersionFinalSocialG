import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { List } from 'lucide-react';
import MenageForm from './MenageForm';

const Menages = () => {
    const navigate = useNavigate();

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 w-full max-w-2xl mx-auto px-4"
        >
            {/* Formulaire MenageForm efa namboarina */}
            <MenageForm />

            {/* Bokotra Voir la liste namboarina */}
            <motion.button 
                whileHover={{ scale: 1.01, backgroundPosition: "100% 0%" }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigate('/home/menage/list')} 
                style={{ 
                    backgroundImage: "linear-gradient(90deg, #1e293b, #334155, #1e293b)",
                    backgroundSize: "200% 100%"
                }}
                className="w-full text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center space-x-2 transition-all duration-500 mb-8"
            >
                <List size={20} />
                <span>VOIR LA LISTE DES MÉNAGES</span>
            </motion.button>
        </motion.div>
    );
};

export default Menages;