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
            .catch((err) => {
                console.error(err);
                Swal.fire('Erreur', 'Email ou mot de passe incorrect', 'error');
            });
    };

    const processScan = useCallback((qrCodeData) => {
        publicApi.post('/Login/scan', { email: qrCodeData, password: "" })
            .then((res) => {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('role', res.data.role);
                Swal.fire('Succès', 'Connexion réussie', 'success').then(() => navigate('/home'));
            })
            .catch(() => Swal.fire('Erreur', 'Code QR invalide', 'error'));
    }, [navigate]);

    const startCamera = useCallback(async () => {
        if (!document.getElementById("reader")) return;
        
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
        } catch (err) {
            console.error("Erreur caméra :", err);
            Swal.fire('Erreur', 'Impossible d\'accéder à la caméra.', 'error');
        }
    }, [processScan]);

    useEffect(() => {
        if (isAgentMode) {
            const timer = setTimeout(startCamera, 500);
            return () => {
                clearTimeout(timer);
                if (html5QrCode.current?.isScanning) {
                    html5QrCode.current.stop().catch(() => {});
                }
            };
        }
    }, [isAgentMode, startCamera]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-[30px] shadow-2xl overflow-hidden min-h-[500px]">
                <motion.div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
                    <h2 className="text-3xl font-bold mb-8 text-indigo-600">{isAgentMode ? "Connexion Agent / Chef" : "Connexion Admin"}</h2>
                    
                    <AnimatePresence mode="wait">
                        {!isAgentMode ? (
                            <motion.div key="admin" className="space-y-4">
                                <input className="w-full p-4 border rounded-xl" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                                <input className="w-full p-4 border rounded-xl" type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} />
                                <button onClick={handleAdminLogin} className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700">SE CONNECTER</button>
                            </motion.div>
                        ) : (
                            <motion.div key="agent">
                                <div id="reader" style={{ width: "100%", height: "250px" }} className="border-2 border-dashed rounded-xl overflow-hidden mb-4 bg-gray-100"></div>
                                <button onClick={() => fileInputRef.current.click()} className="w-full bg-gray-800 text-white p-3 rounded-xl font-bold">IMPORTER UNE PHOTO QR</button>
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
                    <button onClick={() => setIsAgentMode(!isAgentMode)} className="mt-6 text-indigo-600 underline text-sm">{isAgentMode ? "Retour mode Admin" : "Passer en mode Agent / Chef"}</button>
                </motion.div>
                <div className="hidden md:flex w-1/2 bg-slate-900 text-white flex-col justify-center items-center p-12">
                    <h1 className="text-5xl font-bold mb-3">SOCIALGASY</h1>
                </div>
            </div>
        </div>
    );
};

export default Login;