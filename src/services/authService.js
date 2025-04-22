import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const authService = {
  // Connexion
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (response.data && response.data.user && response.data.token) {
        const userData = {
          ...response.data.user,
          token: response.data.token,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        return { user: userData };
      }
      throw new Error("Format de réponse inattendu");
    } catch (error) {
      throw error.response?.data || { message: "Erreur lors de la connexion" };
    }
  },

  // Inscription
  register: async (username, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      });
      if (response.data && response.data.user && response.data.token) {
        const userData = {
          ...response.data.user,
          token: response.data.token,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        return { user: userData };
      }
      throw new Error("Format de réponse inattendu");
    } catch (error) {
      throw error.response?.data || { message: "Erreur lors de l'inscription" };
    }
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('user');
  },

  // Obtenir l'utilisateur actuellement connecté
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Récupérer le token d'authentification
  getToken: () => {
    const user = authService.getCurrentUser();
    return user?.token || null;
  },
};

export default authService;
