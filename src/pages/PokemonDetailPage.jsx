import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPokemonById, deletePokemon  } from '../services/api';

const PokemonDetailPage = () => {
  const { id } = useParams(); // Récupère l'ID du Pokémon depuis l'URL
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await getPokemonById(id);
        console.log('pokemon data :', response); // Affichez la réponse complète
        setPokemon(response.data); // Utilisez response.data pour accéder aux données
      } catch (error) {
        console.error(`Error fetching pokemon with id ${id}:`, error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deletePokemon(id);
      navigate('/');
    } catch (error) {
      console.error(`Error deleting pokemon with id ${id}:`, error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!pokemon) {
    return <div>Pokémon not found.</div>;
  }

  return (
    <div>
      <h1>{pokemon.name?.english || 'Unknown'}</h1>
      <p>Japan : {pokemon.name?.japanese || 'Unknown'}</p>
      <p>Chinese : {pokemon.name?.chinese || 'Unknown'}</p>
      <p>French : {pokemon.name?.french || 'Unknown'}</p>
      <img src={pokemon.image} alt={pokemon.name?.english || 'Pokemon'} />
      <p>Type: {Array.isArray(pokemon.type) ? pokemon.type.join(', ') : 'Unknown'}</p>
      <p>HP: {pokemon.base?.HP || 'Unknown'}</p>
      <p>Attack: {pokemon.base?.Attack || 'Unknown'}</p>
      <p>Defense: {pokemon.base?.Defense || 'Unknown'}</p>
      <p>Sp. Attack: {pokemon.base?.['Sp. Attack'] || 'Unknown'}</p>
      <p>Sp. Defense: {pokemon.base?.['Sp. Defense'] || 'Unknown'}</p>
      <p>Speed: {pokemon.base?.Speed || 'Unknown'}</p>
      <button onClick={handleDelete}>Delete Pokémon</button>
    </div>
  );
};

export default PokemonDetailPage;