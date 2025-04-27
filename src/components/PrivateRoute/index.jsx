import { Navigate } from 'react-router-dom';

// Composant de route privée : protège l'accès à certaines pages
const PrivateRoute = ({ children }) => {
  // Vérifie si l'utilisateur est connecté (présence d'un user dans le localStorage)
  const isAuthenticated = localStorage.getItem('user') !== null;

  // Si l'utilisateur n'est pas connecté, on le redirige vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur est connecté, on affiche le contenu protégé
  return children;
};

export default PrivateRoute; 