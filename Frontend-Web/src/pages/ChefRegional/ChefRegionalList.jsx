import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import chefService from '../../services/chefRegionalService';

const ChefRegionalListe = () => {
    const [chefs, setChefs] = useState([]);

    useEffect(() => {
        const fetchChefs = async () => {
            try {
                const response = await chefService.getAll();
                // Hamarino hoe "Id" sa "id" no ao amin'ny response.data
                setChefs(Array.isArray(response.data) ? response.data : []);
            } catch {
                alert("Erreur lors du chargement de la liste.");
            }
        };
        fetchChefs();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce chef ?")) {
            try {
                await chefService.delete(id);
                setChefs(chefs.filter(c => c.id !== id && c.Id !== id));
            } catch {
                alert("Erreur lors de la suppression.");
            }
        }
    };

    return (
        <table className="w-full border-collapse border">
            <thead>
                <tr className="bg-gray-100">
                    <th className="border p-2">Nom</th>
                    <th className="border p-2">Prenom</th>
                    <th className="border p-2">Adresse</th>
                    <th className="border p-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {chefs.map((chef, index) => (
                    // Mampiasa index toy izao raha tsy azo antoka ny "id"
                    <tr key={chef.id || chef.Id || index}>
                        <td className="border p-2">{chef.nom}</td>
                        <td className="border p-2">{chef.prenom}</td>
                        <td className="border p-2">{chef.adresse}</td>
                        <td className="border p-2 flex gap-2">
                            <Link to={`/home/chefs/details/${chef.id || chef.Id}`} className="bg-green-500 text-white px-2 py-1 rounded">Detail</Link>
                            <Link to={`/home/chefs/edit/${chef.id || chef.Id}`} className="bg-yellow-500 text-white px-2 py-1 rounded">Modifier</Link>
                            <button onClick={() => handleDelete(chef.id || chef.Id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ChefRegionalListe;