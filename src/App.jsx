// Importation des modules nécessaires de React Router et des composants internes
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Header from './components/Header/header';
import './App.css';
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from './context/AuthContext';

// Composant qui gère le contenu principal de l'application
const AppContent = () => {
  // Récupère la localisation actuelle (URL) grâce à React Router
  const location = useLocation();
  // Vérifie si l'utilisateur est sur la page d'accueil
  const isHomePage = location.pathname === '/';
  
  return (
    // Conteneur principal avec une classe CSS pour le style
    <div className="app">
      {/* Affiche le Header, en passant l'info si on est sur la page d'accueil */}
      <Header isHomePage={isHomePage} />
      {/* Affiche les routes de l'application (pages) */}
      <AppRoutes />
    </div>
  );
};

// Composant principal qui englobe toute l'application
function App() {
  return (
    // Router permet la navigation entre les pages sans recharger la page
    <Router>
      {/* AuthProvider permet de partager l'état d'authentification à tous les composants */}
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;