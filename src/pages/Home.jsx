import { useEffect, useState } from 'react';
import { getAllPokemons } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

function HomePage() {
  const navigate = useNavigate();
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllPokemons()
      .then(response => {
        if (!response || !Array.isArray(response)) {
          throw new Error("Invalid API response format");
        }
        setPokemons(response); // Utilise directement le tableau renvoyé par l'API
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch pokemons", error);
        setError(error.message || "Erreur inconnue");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement des Pokémon...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="home-container">
      <h1 className="title">Liste des Pokémon</h1>
      <button className="create-button" onClick={() => navigate('/create')}>
        Créer un nouveau Pokémon
      </button>
      <div className="pokemon-grid">
        {pokemons.map((pokemon) => {
          return (
            <div key={pokemon._id} className="pokemon-card">  
            <img src={pokemon.image} alt={pokemon.name.english} className="pokemon-image" />
            <Link to={`/pokemons/${pokemon._id}`} className="pokemon-link">
              <h2 className="pokemon-name">{pokemon.name.english}</h2>
            </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HomePage;