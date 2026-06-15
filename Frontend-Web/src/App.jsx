import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Menages from './pages/Menage/Menages';
import MenageList from './pages/Menage/MenageList';
import MenageForm from './pages/Menage/MenageForm';
import MenageDetail from './pages/Menage/MenageDetail';
import CitoyenList from './pages/Citoyen/CitoyenList';
import CitoyenForm from './pages/Citoyen/CitoyenForm';
import CitoyenDetails from './pages/Citoyen/CitoyenDetails';
import StatistiquePage from './pages/StatistiquePage';
import ChefRegionalList from './pages/ChefRegional/ChefRegionalList';
import ChefRegionalForm from './pages/ChefRegional/ChefRegionalForm';
import ChefRegionalDetails from './pages/ChefRegional/ChefRegionalDetails';
import ChefRegionalEdit from './pages/ChefRegional/ChefRegionalEdit';

import AgentListe from './pages/Agent/AgentList';
import AgentForm from './pages/Agent/AgentForm';
import AgentEdit from './pages/Agent/AgentEdit';
import AgentDetail from './pages/Agent/AgentDetail';

const PrivateRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem('role');
  if (!role) return <Navigate to="/" />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/home" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home/*" element={<Home />}>
          <Route index element={<h1 className="text-2xl font-bold">Bienvenue</h1>} />
          
          <Route path="menage" element={<Menages />} />
          <Route path="menage/list" element={<MenageList />} />
          <Route path="menage/add" element={<MenageForm />} />
          <Route path="menage/edit/:id" element={<MenageForm />} />
          <Route path="menage/detail/:id" element={<MenageDetail />} />

          <Route path="citoyens/list" element={<CitoyenList />} />
          <Route path="citoyens/add" element={<CitoyenForm />} />
          <Route path="citoyens/edit/:id" element={<CitoyenForm />} />
          <Route path="citoyens/details/:id" element={<CitoyenDetails />} />
          
          <Route path="statistiques" element={<StatistiquePage />} />
          <Route path="rapport" element={<div>Rapports</div>} />

          <Route path="chefs/list" element={<PrivateRoute allowedRoles={['Admin']}><ChefRegionalList /></PrivateRoute>} />
          <Route path="chefs/add" element={<PrivateRoute allowedRoles={['Admin']}><ChefRegionalForm /></PrivateRoute>} />
          <Route path="chefs/edit/:id" element={<PrivateRoute allowedRoles={['Admin']}><ChefRegionalEdit /></PrivateRoute>} />
          <Route path="chefs/details/:id" element={<PrivateRoute allowedRoles={['Admin']}><ChefRegionalDetails /></PrivateRoute>} />

          {/* Routes Agent vaovao */}
          <Route path="agents/list" element={<PrivateRoute allowedRoles={['Admin', 'ChefRegional']}><AgentListe /></PrivateRoute>} />
          <Route path="agents/add" element={<PrivateRoute allowedRoles={['Admin', 'ChefRegional']}><AgentForm /></PrivateRoute>} />
          <Route path="agents/edit/:id" element={<PrivateRoute allowedRoles={['Admin', 'ChefRegional']}><AgentEdit /></PrivateRoute>} />
          <Route path="agents/details/:id" element={<PrivateRoute allowedRoles={['Admin', 'ChefRegional']}><AgentDetail /></PrivateRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;