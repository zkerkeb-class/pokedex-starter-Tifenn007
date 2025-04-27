import axios from "axios";

// Création d'une instance Axios avec l'URL de base du backend
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Fonction pour récupérer les données de l'utilisateur connecté
export const getCurrentUserData = async (token) => {
  try {
    const response = await api.get('/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    if (Array.isArray(data.pokemons)) {
      data.pokemons = data.pokemons.map(p => ({
        ...p,
        image: p.image && !/^https?:/.test(p.image)
          ? `http://localhost:3000${p.image}`
          : p.image
      }));
    }
    return data;
  } catch (error) {
    console.error('Error fetching current user data:', error);
    throw error;
  }
};

// Fonction pour acheter un Pokémon (ajoute à l'arsenal de l'utilisateur)
export const buyPokemon = async (pokemonId, token) => {
  try {
    const response = await api.post(`/users/me/buy/${pokemonId}`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de l'achat du Pokémon ${pokemonId}:`, error);
    throw error.response?.data || { message: "Erreur lors de l'achat du Pokémon" };
  }
};

// Fonction pour vendre un Pokémon (retire de l'arsenal de l'utilisateur)
export const sellPokemon = async (pokemonId, token) => {
  try {
    const response = await api.post(`/users/me/sell/${pokemonId}`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la vente du Pokémon ${pokemonId}:`, error);
    throw error.response?.data || { message: "Erreur lors de la vente du Pokémon" };
  }
};

// Fonction pour récupérer le statut des quêtes et de la récompense journalière
export const getQuestsStatus = async (token) => {
  try {
    const response = await api.get('/users/me/quests', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du statut des quêtes :', error);
    throw error.response?.data || error;
  }
};

// Fonction pour réclamer la récompense journalière (10 orbes)
export const claimDailyReward = async (token) => {
  try {
    const response = await api.post('/users/me/daily-reward', null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la réclamation journalière :', error);
    throw error.response?.data || { message: "Erreur lors de la réclamation journalière" };
  }
}; 