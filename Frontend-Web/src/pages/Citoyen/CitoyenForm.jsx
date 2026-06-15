import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
            if (videoRef.current) videoRef.current.srcObject = stream;
            setIsCameraActive(true);
        } catch {
            alert("Tsy afaka miditra amin'ny caméra ianao.");
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
            if (value !== null && value !== '') {
                formData.append(key, value);
            }
        });
        
        if (photo) formData.append('file', photo);

        try {
            if (id) {
                await updateCitoyen(id, formData);
            } else {
                await createCitoyen(formData);
            }
            navigate('/home/citoyens/list');
        } catch (error) {
            console.error("Erreur:", error);
            alert("Nisy olana nitranga tamin'ny fandefasana data.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded space-y-4">
            <h2 className="text-xl font-bold">{id ? "Modifier" : "Ajouter"} un Citoyen</h2>
            
            <div className="flex flex-col items-center border p-4 rounded bg-gray-50">
                {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-32 h-32 object-cover rounded-full mb-2 border-2" />
                ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-2">No Photo</div>
                )}
                
                <button type="button" onClick={startCamera} className="bg-indigo-600 text-white px-4 py-2 rounded text-sm">
                    {isCameraActive ? "Caméra activée..." : "Prendre une photo"}
                </button>
                
                {isCameraActive && (
                    <div className="mt-4">
                        <video ref={videoRef} autoPlay playsInline className="w-full max-w-xs rounded mb-2" />
                        <button type="button" onClick={capturePhoto} className="bg-red-600 text-white px-4 py-2 w-full rounded">Capturer</button>
                    </div>
                )}
            </div>

            <select className="w-full p-2 border" value={form.menageId} onChange={e => setForm({...form, menageId: e.target.value})}>
                <option value="">Sélectionner un Ménage</option>
                {menages.map(m => <option key={m.id} value={m.id}>{m.fokontany} - {m.commune}</option>)}
            </select>

            <input placeholder="Nom" className="w-full p-2 border" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} />
            <input placeholder="Prénom" className="w-full p-2 border" value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} />
            <input type="date" className="w-full p-2 border" value={form.dateNaissance ? form.dateNaissance.split('T')[0] : ''} onChange={e => setForm({...form, dateNaissance: e.target.value})} />
            <input placeholder="CIN" className="w-full p-2 border" value={form.cin} onChange={e => setForm({...form, cin: e.target.value})} />
            
            <select className="w-full p-2 border" value={form.situationMatrimoniale} onChange={e => setForm({...form, situationMatrimoniale: e.target.value})}>
                <option value="Célibataire">Célibataire</option>
                <option value="Manambady">Manambady</option>
                <option value="Divorcé(e)">Divorcé(e)</option>
                <option value="Veuf(ve)">Veuf(ve)</option>
            </select>

            {form.situationMatrimoniale === 'Manambady' && (
                <input type="number" placeholder="Nombre d'enfants" className="w-full p-2 border" 
                    value={form.nombreEnfants} onChange={e => setForm({...form, nombreEnfants: parseInt(e.target.value) || 0})} />
            )}

            <input placeholder="Profession" className="w-full p-2 border" value={form.profession} onChange={e => setForm({...form, profession: e.target.value})} />
            
            <select className="w-full p-2 border" value={form.sexe} onChange={e => setForm({...form, sexe: e.target.value})}>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
            </select>
            
            <button type="submit" className="w-full bg-green-600 text-white p-2 font-bold">Enregistrer</button>
        </form>
    );
};
export default CitoyenForm;