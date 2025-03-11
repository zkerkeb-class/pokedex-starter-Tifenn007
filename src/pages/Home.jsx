import React, { useEffect, useState } from 'react';
import { getAllPokemons } from '../services/api';
import { Link } from 'react-router-dom';

function HomePage() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllPokemons()
      .then(response => {
        console.log("Received data:", response);
        if (!response || !Array.isArray(response.pokemons)) {
          throw new Error("Invalid API response format");
        }
        setPokemons(response.pokemons);
        console.log("Updated pokemons state:", response.pokemons); // Vérifie si l'état est bien mis à jour
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch pokemons", error);
        setError(error);
        setLoading(false);
      });
  }, []);
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Pokémon List</h1>
      <ul>
  {pokemons.map((pokemon, index) => (
    pokemon?.name?.english ? ( // Vérifie que `name` et `name.english` existent
      <li key={pokemon.id || index}>
        <Link to={`/pokemons/${pokemon.id}`} style={{ textDecoration: "none", color: "blue" }}>
          <strong>{pokemon.name.english}</strong>
          {pokemon.image && <img src={pokemon.image} alt={pokemon.name.english} width="100" />}
        </Link>
      </li>
    ) : (
      <li key={index} style={{ color: "red" }}>Données invalides</li> // Affiche un message d'erreur si nécessaire
    )
  ))}
</ul>
    </div>
  );
}

export default HomePage;
