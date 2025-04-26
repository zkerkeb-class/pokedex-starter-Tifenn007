import { useEffect, useState } from 'react';
import { getAllPokemons, buyPokemon } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import Search from '../components/Search';
import PriceFilter from '../components/PriceFilter/PriceFilter';
import AvailabilityFilter from '../components/AvailabilityFilter/AvailabilityFilter';
import './Home.css';
import Orbes from '../assets/orbes.png';
import { useAuth } from '../context/AuthContext';
import PokemonCard from '../components/PokemonCard';


function HomePage() {
  const { user, updateUser } = useAuth();
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all','available','unavailable','owned'

  // Types de Pokémon disponibles
  const pokemonTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice', 
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 
    'rock', 'ghost', 'dragon', 'steel', 'fairy'
  ];

  // Liste des pokémons déjà possédés par l'utilisateur
  const ownedIds = user?.pokemons?.map(p => p._id) || [];

  // Calcul de la plage globale de prix à partir de tous les Pokémon
  const prices = pokemons.map(p => p.price);
  const globalMinPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const globalMaxPrice = prices.length > 0 ? Math.max(...prices) : 0;

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

  // Filtrer les Pokémon par type, recherche, prix et disponibilité
  const filteredPokemons = pokemons.filter(pokemon => {
    const matchesType = !selectedType ||
      pokemon.types.map(type => type.toLowerCase()).includes(selectedType);
    const matchesSearch = !searchQuery ||
      pokemon.name.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pokemon.name.french.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice =
      (minPrice === '' || pokemon.price >= Number(minPrice)) &&
      (maxPrice === '' || pokemon.price <= Number(maxPrice));
    let matchesAvailability = true;
    if (availabilityFilter === 'available') {
      matchesAvailability = user && user.orbes >= pokemon.price && !ownedIds.includes(pokemon._id);
    } else if (availabilityFilter === 'unavailable') {
      matchesAvailability = user && user.orbes < pokemon.price && !ownedIds.includes(pokemon._id);
    } else if (availabilityFilter === 'owned') {
      matchesAvailability = ownedIds.includes(pokemon._id);
    }
    return matchesType && matchesSearch && matchesPrice && matchesAvailability;
  });

  // Gestion de l'achat d'un Pokémon
  const handleBuy = async (pokemon) => {
    // Restriction pour les administrateurs
    if (user && user.role === 'admin') {
      alert("Vous êtes administrateur et ne pouvez pas acheter de Pokémon.");
      return;
    }
    if (!user) {
      // inviter l'utilisateur à se connecter
      const goLogin = window.confirm(
        "Vous devez être connecté pour acheter le pokémon."
      );
      if (goLogin) navigate('/login');
      return;
    }
    try {
      const data = await buyPokemon(pokemon._id, user.token);
      updateUser({ ...user, orbes: data.orbes, pokemons: data.pokemons });
      alert('Pokémon acheté avec succès !');
    } catch (err) {
      alert(err.message || 'Erreur lors de l\'achat du Pokémon');
    }
  };

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
        {!isAdmin && (
          <div className="orbes-container">
            <img src={Orbes} alt="Orbes" className="orbes-image" />
            <h3>
              <strong className="red-text">Dès ton inscription, reçois 10 Orbes pour bâtir ton arsenal !</strong>
            </h3>
            <img src={Orbes} alt="Orbes" className="orbes-image" />
          </div>
        )}
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
          <PriceFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinChange={setMinPrice}
            onMaxChange={setMaxPrice}
            globalMin={globalMinPrice}
            globalMax={globalMaxPrice}
          />
          <AvailabilityFilter
            value={availabilityFilter}
            onChange={setAvailabilityFilter}
          />
        </div>
      </section>

      {/* Section des Pokémon */}
      <section id="pokemon-section" className="pokemon-section">
        <div className="section-header">
          <h3>{selectedType ? `Pokémon de type ${selectedType}` : 'Tous les Pokémon'}</h3>
          {user && user.role === 'admin' && ( // Vérifiez si l'utilisateur est admin
            <button className="create-button" onClick={() => navigate('/create')}>
              Créer un nouveau Pokémon
            </button>
          )}
        </div>
        
        <div className="pokemon-grid">
          {filteredPokemons.length > 0 ? (
            filteredPokemons.map((pokemon) => {
              const isOwned = ownedIds.includes(pokemon._id);
              return (
                <PokemonCard
                  key={pokemon._id}
                  pokemon={pokemon}
                  isOwned={isOwned}
                  isAdmin={isAdmin}
                  user={user}
                  handleBuy={handleBuy}
                />
              );
            })
          ) : (
            <div className="error">Aucun Pokémon trouvé</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;