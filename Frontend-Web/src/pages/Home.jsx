import { Link, useNavigate, Outlet } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 text-xl font-bold border-b border-slate-700">SOCIALGASY</div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/home/citoyens/list" className="block p-3 hover:bg-indigo-600 rounded">Citoyens</Link>
                    <Link to="/home/menage" className="block p-3 hover:bg-indigo-600 rounded">Ménages</Link>
                    <Link to="/home/statistiques" className="block p-3 hover:bg-indigo-600 rounded">Statistiques</Link>
                    <Link to="/home/rapport" className="block p-3 hover:bg-indigo-600 rounded">Rapports</Link>

                    {role === 'Admin' && (
                        <>
                            <Link to="/home/chefs/list" className="block p-3 hover:bg-indigo-600 rounded">Liste des Chefs</Link>
                            <Link to="/home/chefs/add" className="block p-3 hover:bg-indigo-600 rounded">Ajouter un Chef</Link>
                        </>
                    )}

                    {(role === 'Admin' || role === 'ChefRegional') && (
                        <>
                            <div className="text-xs text-gray-400 uppercase pt-4 pb-1 px-3">Gestion Agents</div>
                            <Link to="/home/agents/list" className="block p-3 hover:bg-indigo-600 rounded">Liste des Agents</Link>
                            <Link to="/home/agents/add" className="block p-3 hover:bg-indigo-600 rounded">Ajouter un Agent</Link>
                        </>
                    )}
                </nav>
                <button onClick={handleLogout} className="p-4 bg-red-600 hover:bg-red-700 text-center">Déconnexion</button>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default Home;