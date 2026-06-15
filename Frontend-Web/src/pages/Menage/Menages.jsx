import MenageForm from './MenageForm';
import { useNavigate } from 'react-router-dom';

const Menages = () => {
    const navigate = useNavigate();
    return (
        <div className="space-y-6">
            <MenageForm />
            <button onClick={() => navigate('/home/menage/list')} className="bg-slate-800 text-white p-3 w-full">
                Voir la liste des ménages enregistrés
            </button>
        </div>
    );
};
export default Menages;