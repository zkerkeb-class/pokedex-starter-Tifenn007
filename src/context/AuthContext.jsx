import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { getCurrentUserData } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charge l'utilisateur depuis le localStorage, puis rafraîchit avec les données complètes
    const loadUser = async () => {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        try {
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

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    if (response.user) {
      const token = response.user.token;
      try {
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

  const register = async (username, email, password) => {
    const response = await authService.register(username, email, password);
    if (response.user) {
      const token = response.user.token;
      try {
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

  const logout = () => {
    authService.logout();
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
