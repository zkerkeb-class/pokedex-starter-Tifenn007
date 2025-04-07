import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Remplacez par l'URL de votre API
});


export const getAllPokemons = async () => {
  try {
    const response = await api.get('/pokemons');
    console.log("API Response:", response.data); // Debug: Vérifie la structure de la réponse
    return response.data; // Assurez-vous que response.data est un tableau
  } catch (error) {
    console.error('Error fetching all pokemons:', error);
    throw error;
  }
};

export const getPokemonById = async (_id) => {
  try {
    console.log("Appel API avec l'ID :", _id); // Debug : Vérifiez l'ID envoyé à l'API
    const response = await api.get(`/pokemons/${_id}`);
    console.log("Réponse de l'API :", response.data); // Debug : Vérifiez la réponse
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