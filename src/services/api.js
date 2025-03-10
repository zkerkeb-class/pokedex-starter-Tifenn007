import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Remplacez par l'URL de votre API
});

export const getAllPokemons = async () => {
  try {
    const response = await api.get('/pokemons'); // Assurez-vous que l'endpoint est correct
    return response.data; // Renvoie directement le tableau de Pokémon
  } catch (error) {
    console.error('Error fetching all pokemons:', error);
    throw error;
  }
};


export const getPokemonById = async (id) => {
  try {
    const response = await api.get(`/pokemons/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching pokemon with id ${id}:`, error);
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