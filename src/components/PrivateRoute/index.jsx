import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Vérifier si l'utilisateur est connecté
  // Utiliser la clé 'user' qui est utilisée dans authService
  const isAuthenticated = localStorage.getItem('user') !== null;

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur est connecté, afficher le contenu
  return children;
};

export default PrivateRoute; 