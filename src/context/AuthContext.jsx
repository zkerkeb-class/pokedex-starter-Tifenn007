import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { getCurrentUserData } from '../services/api/userApi';

// Création du contexte d'authentification
const AuthContext = createContext(null);

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Utilisateur connecté
  const [loading, setLoading] = useState(true); // Indique si l'auth est en cours de chargement

  useEffect(() => {
    // Au montage, charge l'utilisateur depuis le localStorage puis rafraîchit avec les données complètes
    const loadUser = async () => {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        try {
          // Récupère les infos complètes de l'utilisateur via l'API
          const fullUser = await getCurrentUserData(parsed.token);
          const merged = { ...fullUser, token: parsed.token };
          setUser(merged);
          localStorage.setItem('user', JSON.stringify(merged));
        } catch (err) {
          console.error("Erreur lors de l'actualisation de l'utilisateur :", err);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Connexion de l'utilisateur
  const login = async (email, password) => {
    const response = await authService.login(email, password);
    if (response.user) {
      const token = response.user.token;
      try {
        // Récupère les infos complètes de l'utilisateur
        const fullUser = await getCurrentUserData(token);
        const mergedUser = { ...fullUser, token };
        setUser(mergedUser);
        localStorage.setItem('user', JSON.stringify(mergedUser));
        return { user: mergedUser };
      } catch (err) {
        console.error("Erreur lors du chargement de l'utilisateur complet :", err);
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        return { user: response.user };
      }
    }
    return response;
  };

  // Inscription d'un nouvel utilisateur
  const register = async (username, email, password) => {
    // On effectue seulement l'inscription, sans connecter automatiquement l'utilisateur
    return await authService.register(username, email, password);
  };

  // Déconnexion de l'utilisateur
  const logout = () => {
    authService.logout();
    localStorage.removeItem('user');
    setUser(null);
  };

  // Met à jour les infos de l'utilisateur dans le contexte et le localStorage
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Valeur du contexte fournie aux composants enfants
  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
