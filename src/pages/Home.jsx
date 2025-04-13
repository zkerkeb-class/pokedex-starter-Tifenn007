import { useEffect, useState } from 'react';
import { getAllPokemons } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import Search from '../components/Search';
import './Home.css';

function HomePage() {
  const navigate = useNavigate();
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Types de Pokémon disponibles
  const pokemonTypes = [
    'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 
    'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 
    'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
  ];

  useEffect(() => {
    getAllPokemons()
      .then(response => {
        if (!response || !Array.isArray(response)) {
          throw new Error("Invalid API response format");
        }
        setPokemons(response);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch pokemons", error);
        setError(error.message || "Erreur inconnue");
        setLoading(false);
      });
  }, []);

  // Filtrer les Pokémon par type et recherche
  const filteredPokemons = pokemons.filter(pokemon => {
    const matchesType = !selectedType || pokemon.type.includes(selectedType);
    const matchesSearch = !searchQuery || 
      pokemon.name.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pokemon.name.french.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (loading) return <div className="loading">Chargement des Pokémon...</div>;
  if (error) return <div className="error">Erreur : {error}</div>;

  return (
    <div className="home-container">
      {/* Section d'introduction */}
      <section className="intro-section">
        <h2>Bienvenue dans le monde des Pokémon</h2>
        <p>
          Explorez notre Pokédex complet et découvrez des informations détaillées sur chaque Pokémon.
          Que vous soyez un dresseur débutant ou un expert, vous trouverez ici tout ce dont vous avez besoin.
        </p>
      </section>

      {/* Section de filtrage et recherche */}
      <section className="filter-section">
        <div className="filter-search-container">
          <div className="filter-container">
            <h3>Filtrer par type</h3>
            <div className="type-filters">
              <button 
                className={`type-button ${selectedType === null ? 'active' : ''}`}
                onClick={() => setSelectedType(null)}
              >
                Tous
              </button>
              {pokemonTypes.map(type => (
                <button 
                  key={type}
                  className={`type-button ${selectedType === type ? 'active' : ''}`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="search-container">
            <h3>Rechercher un Pokémon</h3>
            <Search onSearch={setSearchQuery} />
          </div>
        </div>
      </section>

      {/* Section des Pokémon */}
      <section id="pokemon-section" className="pokemon-section">
        <div className="section-header">
          <h3>{selectedType ? `Pokémon de type ${selectedType}` : 'Tous les Pokémon'}</h3>
          <button className="create-button" onClick={() => navigate('/create')}>
            Créer un nouveau Pokémon
          </button>
        </div>
        
        <div className="pokemon-grid">
          {filteredPokemons.map((pokemon) => (
            <div key={pokemon._id} className="pokemon-card">
              <img src={pokemon.image} alt={pokemon.name.english} className="pokemon-image" />
              <div className="pokemon-info">
                <Link to={`/pokemons/${pokemon._id}`} className="pokemon-link">
                  <h2 className="pokemon-name">{pokemon.name.english}</h2>
                </Link>
                <div className="pokemon-types">
                  {pokemon.type && pokemon.type.map((type, index) => (
                    <span key={index} className={`pokemon-type ${type.toLowerCase()}`}>
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;