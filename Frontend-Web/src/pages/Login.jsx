import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { publicApi } from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [isAgentMode, setIsAgentMode] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const html5QrCode = useRef(null);
    const fileInputRef = useRef(null);

    const handleAdminLogin = () => {
        if (!email || !password) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs', 'warning');
            return;
        }

        publicApi.post('/Login/admin', { email: email.trim(), password: password.trim() })
            .then((res) => {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('role', res.data.role);
                Swal.fire('Succès', 'Connexion réussie', 'success').then(() => navigate('/home'));
            })
            .catch(() => {
                Swal.fire('Erreur', 'Email ou mot de passe incorrect', 'error');
            });
    };

    const processScan = useCallback((qrCodeData) => {
        const cleanedQr = qrCodeData ? qrCodeData.trim() : "";
        publicApi.post('/Login/scan', { email: cleanedQr, password: "" })
            .then((res) => {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('role', res.data.role);
                Swal.fire('Succès', 'Connexion réussie', 'success').then(() => navigate('/home'));
            })
            .catch(() => Swal.fire('Erreur', 'Code QR invalide', 'error'));
    }, [navigate]);

    const startCamera = useCallback(async () => {
        const readerElement = document.getElementById("reader");
        if (!readerElement) return;
        
        try {
            html5QrCode.current = new Html5Qrcode("reader");
            await html5QrCode.current.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => {
                    html5QrCode.current.stop();
                    processScan(decodedText);
                }
            );
        } catch {
            Swal.fire('Erreur', 'Impossible d\'accéder à la caméra.', 'error');
        }
    }, [processScan]);

    useEffect(() => {
        if (isAgentMode) {
            const timer = setTimeout(startCamera, 600);
            return () => {
                clearTimeout(timer);
                if (html5QrCode.current?.isScanning) {
                    html5QrCode.current.stop().catch(() => {});
                }
            };
        }
    }, [isAgentMode, startCamera]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
            <motion.div 
                layout
                className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[550px]"
            >
                <motion.div 
                    layout
                    className={`w-full md:w-1/2 p-12 flex flex-col justify-center bg-white ${isAgentMode ? 'md:order-2' : 'md:order-1'}`}
                >
                    <h2 className="text-3xl font-extrabold mb-8 text-slate-800">
                        {isAgentMode ? "Accès Agent / Chef" : "Connexion Admin"}
                    </h2>
                    
                    <div className="relative">
                        <AnimatePresence mode="wait">
                            {!isAgentMode ? (
                                <motion.div 
                                    key="admin"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                    className="space-y-4"
                                >
                                    <input className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                                    <input className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} />
                                    <motion.button 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleAdminLogin} 
                                        className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold shadow-lg"
                                    >
                                        SE CONNECTER
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="agent"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                >
                                    <div id="reader" className="w-full h-[250px] border-2 border-dashed border-slate-300 rounded-xl overflow-hidden mb-4 bg-slate-50 flex items-center justify-center"></div>
                                    <motion.button 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => fileInputRef.current.click()} 
                                        className="w-full bg-slate-800 text-white p-3 rounded-xl font-bold"
                                    >
                                        IMPORTER UNE PHOTO QR
                                    </motion.button>
                                    <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={async (e) => {
                                        const qr = new Html5Qrcode("reader");
                                        try { 
                                            const text = await qr.scanFile(e.target.files[0], true);
                                            processScan(text);
                                        } catch { Swal.fire('Erreur', 'Aucun code QR trouvé', 'error'); }
                                    }} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.button 
                        whileHover={{ x: 5 }}
                        onClick={() => setIsAgentMode(!isAgentMode)} 
                        className="mt-8 text-indigo-600 font-semibold text-sm hover:underline self-start"
                    >
                        {isAgentMode ? "← Retour connexion Admin" : "Passer en mode Agent / Chef →"}
                    </motion.button>
                </motion.div>

                <motion.div 
                    layout
                    className={`hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 to-slate-900 text-white flex-col justify-center items-center p-12 ${isAgentMode ? 'md:order-1' : 'md:order-2'}`}
                >
                    <h1 className="text-5xl font-black tracking-tight">SOCIALGASY</h1>
                    <p className="mt-2 text-indigo-200 font-medium tracking-widest uppercase text-sm">Système de gestion</p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;