import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faUser, faHome, faUserTag, faIdCard, faBriefcase, faVenusMars, faCalendarAlt, faCameraRetro } from '@fortawesome/free-solid-svg-icons';
import { createCitoyen, updateCitoyen, getCitoyenById } from '../../services/citoyenService';
import { getMenages } from '../../services/menageService';

const CitoyenForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [menages, setMenages] = useState([]);
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [form, setForm] = useState({ 
        menageId: '', nom: '', prenom: '', dateNaissance: '', 
        cin: '', situationMatrimoniale: 'Célibataire', nombreEnfants: 0, 
        profession: '', sexe: 'M'
    });

    useEffect(() => {
        getMenages().then(res => setMenages(res.data));
        if (id) {
            getCitoyenById(id).then(res => {
                setForm(res.data);
                if (res.data.photoPath) {
                    setPhotoPreview(`http://localhost:5296${res.data.photoPath}`);
                }
            });
        }
    }, [id]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setIsCameraActive(true);
            setTimeout(() => {
                if (videoRef.current) videoRef.current.srcObject = stream;
            }, 100);
        } catch {
            alert("Accès à la caméra refusé ou non disponible. Veuillez vérifier les permissions.");
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
        
        canvas.toBlob((blob) => {
            const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(blob));
            setIsCameraActive(false);
            if (videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        }, 'image/jpeg');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (value !== null && value !== '') formData.append(key, value);
        });
        if (photo) formData.append('file', photo);

        try {
            if (id) await updateCitoyen(id, formData);
            else await createCitoyen(formData);
            navigate('/home/citoyens/list');
        } catch {
            alert("Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.");
        }
    };

    const inputStyle = "w-full p-2.5 border-2 border-indigo-100 rounded-lg focus:border-indigo-500 outline-none transition-all bg-white text-sm";

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="bg-white p-6 shadow-xl rounded-2xl border border-indigo-50 space-y-6">
                <h2 className="text-2xl font-bold text-indigo-900 text-center uppercase tracking-tight">
                    {id ? "Modifier le Citoyen" : "Ajouter un Citoyen"}
                </h2>
                
                <div className="flex flex-col items-center p-4 bg-indigo-50 rounded-xl border border-dashed border-indigo-200">
                    <div className="w-24 h-24 mb-3 rounded-full overflow-hidden border-4 border-white shadow-md bg-indigo-100 flex items-center justify-center">
                        {photoPreview ? <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" /> : <FontAwesomeIcon icon={faUser} className="text-3xl text-indigo-300" />}
                    </div>
                    
                    {!isCameraActive ? (
                        <button type="button" onClick={startCamera} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all">
                            <FontAwesomeIcon icon={faCameraRetro} className="mr-2" /> Capturer photo
                        </button>
                    ) : (
                        <div className="w-full max-w-xs space-y-2">
                            <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg border-2 border-indigo-600 bg-black" />
                            <button type="button" onClick={capturePhoto} className="bg-red-600 hover:bg-red-700 text-white w-full py-1.5 rounded-lg text-sm font-bold transition-all">Capturer</button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-indigo-800 ml-1"><FontAwesomeIcon icon={faHome} className="mr-1"/>Ménage</label>
                        <select className={inputStyle} value={form.menageId} onChange={e => setForm({...form, menageId: e.target.value})}>
                            <option value="">Sélectionner un ménage</option>
                            {menages.map(m => <option key={m.id} value={m.id}>{m.fokontany} - {m.commune}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-indigo-800 ml-1"><FontAwesomeIcon icon={faUserTag} className="mr-1"/>Nom</label>
                        <input placeholder="Nom" className={inputStyle} value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} />
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-indigo-800 ml-1"><FontAwesomeIcon icon={faUserTag} className="mr-1"/>Prénom</label>
                        <input placeholder="Prénom" className={inputStyle} value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-indigo-800 ml-1"><FontAwesomeIcon icon={faCalendarAlt} className="mr-1"/>Date de Naissance</label>
                        <input type="date" className={inputStyle} value={form.dateNaissance ? form.dateNaissance.split('T')[0] : ''} onChange={e => setForm({...form, dateNaissance: e.target.value})} />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-indigo-800 ml-1"><FontAwesomeIcon icon={faIdCard} className="mr-1"/>CIN</label>
                        <input placeholder="CIN" className={inputStyle} value={form.cin} onChange={e => setForm({...form, cin: e.target.value})} />
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-indigo-800 ml-1">Situation Matrimoniale</label>
                        <select className={inputStyle} value={form.situationMatrimoniale} onChange={e => setForm({...form, situationMatrimoniale: e.target.value})}>
                            <option value="Célibataire">Célibataire</option>
                            <option value="Manambady">Manambady</option>
                            <option value="Divorcé(e)">Divorcé(e)</option>
                            <option value="Veuf(ve)">Veuf(ve)</option>
                        </select>
                    </div>

                    {form.situationMatrimoniale === 'Manambady' && (
                        <div>
                            <label className="text-xs font-bold text-indigo-800 ml-1">Nombre d'enfants</label>
                            <input type="number" className={inputStyle} value={form.nombreEnfants} onChange={e => setForm({...form, nombreEnfants: parseInt(e.target.value) || 0})} />
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-bold text-indigo-800 ml-1"><FontAwesomeIcon icon={faBriefcase} className="mr-1"/>Profession</label>
                        <input placeholder="Profession" className={inputStyle} value={form.profession} onChange={e => setForm({...form, profession: e.target.value})} />
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-indigo-800 ml-1"><FontAwesomeIcon icon={faVenusMars} className="mr-1"/>Sexe</label>
                        <select className={inputStyle} value={form.sexe} onChange={e => setForm({...form, sexe: e.target.value})}>
                            <option value="M">Masculin</option>
                            <option value="F">Féminin</option>
                        </select>
                    </div>
                </div>
                
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-md shadow-lg transition-all active:scale-95">
                    <FontAwesomeIcon icon={faCheck} className="mr-2" /> Enregistrer
                </button>
            </form>
        </motion.div>
    );
};

export default CitoyenForm;