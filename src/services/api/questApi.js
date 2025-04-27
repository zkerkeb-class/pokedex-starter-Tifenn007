import axios from "axios";

// Création d'une instance Axios avec l'URL de base du backend
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Fonction pour récupérer toutes les quêtes dynamiques (admin/active)
export const getAllQuests = async (token) => {
  try {
    const response = await api.get('/quests', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des quêtes dynamiques :', error);
    throw error.response?.data || error;
  }
};

// Fonction pour créer une nouvelle quête (admin)
export const createQuest = async (questData, token) => {
  try {
    const response = await api.post('/quests', questData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la quête :', error);
    throw error.response?.data || error;
  }
};

// Fonction pour mettre à jour une quête (admin)
export const updateQuest = async (id, questData, token) => {
  try {
    const response = await api.put(`/quests/${id}`, questData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la quête :', error);
    throw error.response?.data || error;
  }
};

// Fonction pour supprimer une quête (admin)
export const deleteQuest = async (id, token) => {
  try {
    const response = await api.delete(`/quests/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de la quête :', error);
    throw error.response?.data || error;
  }
};

// Fonction pour désactiver une quête (admin)
export const deactivateQuest = async (id, token) => {
  try {
    const response = await api.patch(`/quests/${id}/deactivate`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la désactivation de la quête :', error);
    throw error.response?.data || error;
  }
};

// Fonction pour activer une quête (admin)
export const activateQuest = async (id, token) => {
  try {
    const response = await api.patch(`/quests/${id}/activate`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'activation de la quête :', error);
    throw error.response?.data || error;
  }
};

// Fonction pour réclamer la récompense d'une quête
export const claimQuestReward = async (questId, token) => {
    try {
      const response = await api.post(`/users/me/quests/${questId}/claim`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la réclamation de la récompense de la quête :', error);
      throw error.response?.data || error;
    }
  };