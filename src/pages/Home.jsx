import React, { useEffect, useState } from 'react';
import { getAllPokemons } from '../services/api';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await getAllPokemons();
        console.log('API response:', response); // Affichez la réponse complète
  
        // Vérifiez si la réponse est un tableau
        const pokemonList = Array.isArray(response.pokemons) ? response.pokemons : [];
        console.log('Pokemon list:', pokemonList);
  
        if (pokemonList.length > 0) {
          console.log('First Pokémon name:', pokemonList[0].name.english);
        } else {
          console.error('Pokemon list is empty:', pokemonList);
        }
  
        setPokemons(pokemonList);
      } catch (error) {
        console.error('Error fetching pokemons:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPokemons();
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!Array.isArray(pokemons)) {
    console.error('Pokemons is not an array:', pokemons);
    return <div>No pokemons found.</div>;
  }

  if (pokemons.length === 0) {
    return <div>No pokemons found.</div>;
  }

  return (
    <div>
      <h1>Pokémon List</h1>
      <Link to="/create">
        <button style={{ marginBottom: '20px' }}>Créer un Pokémon</button>
      </Link>
      <ul>
      {pokemons.map(pokemon => (
        <li key={pokemon.id}>
          <Link to={`/pokemon/${pokemon.id}`}>
            <img src={pokemon.image} alt={pokemon.name.english} style={{ width: '50px', height: '50px' }} />
            {pokemon.name.english}
          </Link>
        </li>
      ))}
    </ul>

    </div>
  );
};

export default HomePage;