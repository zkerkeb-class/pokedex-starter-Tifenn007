import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});


export const getAllPokemons = async () => {
  try {
    const response = await api.get('/pokemons');
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching all pokemons:', error);
    throw error;
  }
};

export const getPokemonById = async (_id) => {
  try {
    console.log("Appel API avec l'ID :", _id);
    const response = await api.get(`/pokemons/${_id}`);
    console.log("Réponse de l'API :", response.data);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du Pokémon avec l'id ${_id} :`, error);
    throw error;
  }
};


export const createPokemon = async (data) => {
  try {
    const response = await api.post('/pokemons', data);
    return response.data;
  } catch (error) {
    console.error('Error creating pokemon:', error);
    throw error;
  }
};

export const updatePokemon = async (id, data) => {
  try {
    const response = await api.put(`/pokemons/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating pokemon with id ${id}:`, error);
    throw error;
  }
};

export const deletePokemon = async (id) => {
  try {
    const response = await api.delete(`/pokemons/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting pokemon with id ${id}:`, error);
    throw error;
  }
};

// Nouvel export pour récupérer les données de l'utilisateur connecté
export const getCurrentUserData = async (token) => {
  try {
    const response = await api.get('/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current user data:', error);
    throw error;
  }
};

// Ajout de la fonction pour acheter un Pokémon
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

// Ajout de la fonction pour vendre un Pokémon
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

// Récupérer le statut des quêtes et de la récompense journalière
export const getQuestsStatus = async (token) => {
  try {
    const response = await api.get('/users/me/quests', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data; // { dailyRewardClaimed, orbesReward, quests: [...] }
  } catch (error) {
    console.error('Erreur lors de la récupération du statut des quêtes :', error);
    throw error.response?.data || error;
  }
};

// Réclamer la récompense journalière (10 orbes)
export const claimDailyReward = async (token) => {
  try {
    const response = await api.post('/users/me/daily-reward', null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data; // { success, message, orbes, lastDailyReward }
  } catch (error) {
    console.error('Erreur lors de la réclamation journalière :', error);
    throw error.response?.data || { message: "Erreur lors de la réclamation journalière" };
  }
};

// Récupérer la liste des quêtes dynamiques (admin/active)
export const getAllQuests = async (token) => {
  try {
    const response = await api.get('/quests', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data; // tableau de quêtes
  } catch (error) {
    console.error('Erreur lors de la récupération des quêtes dynamiques :', error);
    throw error.response?.data || error;
  }
};

// Créer une nouvelle quête (admin)
export const createQuest = async (questData, token) => {
  try {
    const response = await api.post('/quests', questData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la création de la quête :', error);
    throw error.response?.data || error;
  }
};

// Mettre à jour une quête (admin)
export const updateQuest = async (id, questData, token) => {
  try {
    const response = await api.put(`/quests/${id}`, questData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la quête ${id} :`, error);
    throw error.response?.data || error;
  }
};

// Désactiver (supprimer) une quête (admin)
export const deleteQuest = async (id, token) => {
  try {
    const response = await api.delete(`/quests/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression de la quête ${id} :`, error);
    throw error.response?.data || error;
  }
};

// Désactiver (soft-delete) une quête (admin)
export const deactivateQuest = async (id, token) => {
  try {
    const response = await api.patch(`/quests/${id}/deactivate`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error(`Erreur désactivation quête ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Activer une quête (admin)
export const activateQuest = async (id, token) => {
  try {
    const response = await api.patch(`/quests/${id}/activate`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error(`Erreur activation quête ${id}:`, error);
    throw error.response?.data || error;
  }
};

export const claimQuestReward = async (questId, token) => {
  const response = await api.post(
    `/users/me/quests/${questId}/claim`,
    null,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
