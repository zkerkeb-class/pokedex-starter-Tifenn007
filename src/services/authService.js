import axios from 'axios';

// URL de base de l'API backend
const API_URL = 'http://localhost:3000/api';

// Service d'authentification pour gérer la connexion, l'inscription, la déconnexion et la récupération de l'utilisateur
const authService = {
  // Connexion de l'utilisateur
  // email : l'adresse email de l'utilisateur
  // password : le mot de passe de l'utilisateur
  login: async (email, password) => {
    try {
      // Envoie une requête POST à l'API pour se connecter
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      // Vérifie si la réponse contient bien les données attendues (utilisateur et token)
      if (response.data && response.data.user && response.data.token) {
        // On regroupe les infos utilisateur et le token dans un objet
        const userData = {
          ...response.data.user,
          token: response.data.token,
        };
        // On sauvegarde l'utilisateur connecté dans le localStorage du navigateur
        localStorage.setItem('user', JSON.stringify(userData));
        return { user: userData };
      }
      // Si la réponse n'est pas conforme, on lève une erreur
      throw new Error("Format de réponse inattendu");
    } catch (error) {
      // Gestion des erreurs : on renvoie le message d'erreur de l'API ou un message par défaut
      throw error.response?.data || { message: "Erreur lors de la connexion" };
    }
  },

  // Inscription d'un nouvel utilisateur
  // username : le nom d'utilisateur choisi
  // email : l'adresse email de l'utilisateur
  // password : le mot de passe choisi
  register: async (username, email, password) => {
    try {
      // Envoie une requête POST à l'API pour s'inscrire
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      });
      // Vérifie si la réponse contient bien les données attendues (utilisateur et token)
      if (response.data && response.data.user && response.data.token) {
        // On regroupe les infos utilisateur et le token dans un objet
        const userData = {
          ...response.data.user,
          token: response.data.token,
        };
        // On sauvegarde l'utilisateur connecté dans le localStorage du navigateur
        localStorage.setItem('user', JSON.stringify(userData));
        return { user: userData };
      }
      // Si la réponse n'est pas conforme, on lève une erreur
      throw new Error("Format de réponse inattendu");
    } catch (error) {
      // Gestion des erreurs : on renvoie le message d'erreur de l'API ou un message par défaut
      throw error.response?.data || { message: "Erreur lors de l'inscription" };
    }
  },

  // Déconnexion de l'utilisateur (suppression des infos du localStorage)
  logout: () => {
    localStorage.removeItem('user');
  },

  // Récupère l'utilisateur actuellement connecté depuis le localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    // Si un utilisateur est stocké, on le retourne sous forme d'objet, sinon null
    return user ? JSON.parse(user) : null;
  },

  // Récupère uniquement le token d'authentification de l'utilisateur connecté
  getToken: () => {
    const user = authService.getCurrentUser();
    // On retourne le token si l'utilisateur existe, sinon null
    return user?.token || null;
  },
};

export default authService;
