import axios from "axios";

// Création d'une instance Axios avec l'URL de base du backend
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Fonction pour récupérer tous les Pokémons
export const getAllPokemons = async () => {
  try {
    const response = await api.get('/pokemons');
    const pokemons = response.data.map(p => ({
      ...p,
      image: p.image && !/^https?:/.test(p.image)
        ? `http://localhost:3000${p.image}`
        : p.image
    }));
    return pokemons;
  } catch (error) {
    console.error('Error fetching all pokemons:', error);
    throw error;
  }
};

// Fonction pour récupérer un Pokémon par son ID
export const getPokemonById = async (_id) => {
  try {
    const response = await api.get(`/pokemons/${_id}`);
    const pokemon = response.data;
    if (pokemon.image && !/^https?:/.test(pokemon.image)) {
      pokemon.image = `http://localhost:3000${pokemon.image}`;
    }
    return pokemon;
  } catch (error) {
    console.error(`Erreur lors de la récupération du Pokémon avec l'id ${_id} :`, error);
    throw error;
  }
};

// Fonction pour créer un nouveau Pokémon
export const createPokemon = async (data, token) => {
  try {
    if (data instanceof FormData) {
      const config = { headers: {} };
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      const response = await api.post('/pokemons', data, config);
      return response.data;
    }
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    const response = await api.post('/pokemons', data, config);
    return response.data;
  } catch (error) {
    console.error('Error creating pokemon:', error);
    throw error;
  }
};

// Fonction pour mettre à jour un Pokémon existant
export const updatePokemon = async (id, data, token) => {
  try {
    let config = {};
    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }
    if (data instanceof FormData) {
      const response = await api.put(`/pokemons/${id}`, data, config);
      return response.data;
    }
    const response = await api.put(`/pokemons/${id}`, data, config);
    return response.data;
  } catch (error) {
    console.error(`Error updating pokemon with id ${id}:`, error);
    throw error;
  }
};

// Fonction pour supprimer un Pokémon
export const deletePokemon = async (id, token) => {
  try {
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    const response = await api.delete(`/pokemons/${id}`, config);
    return response.data;
  } catch (error) {
    console.error(`Error deleting pokemon with id ${id}:`, error);
    throw error;
  }
}; 