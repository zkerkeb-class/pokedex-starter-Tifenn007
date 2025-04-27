import { useEffect, useState } from 'react';
import { getAllPokemons } from '../services/api/pokemonApi';
import { buyPokemon } from '../services/api/userApi';
import { useNavigate } from 'react-router-dom';
import Search from '../components/Search';
import PriceFilter from '../components/PriceFilter/PriceFilter';
import AvailabilityFilter from '../components/AvailabilityFilter/AvailabilityFilter';
import './Home.css';
import Orbes from '../assets/orbes.png';
import { useAuth } from '../context/AuthContext';
import PokemonCard from '../components/PokemonCard';

// Page d'accueil qui affiche la liste des Pokémon et les filtres
function HomePage() {
  const { user, updateUser } = useAuth();
  const isAdmin = user?.role === 'admin'; // Vérifie si l'utilisateur est admin
  const navigate = useNavigate();
  const [pokemons, setPokemons] = useState([]); // Liste de tous les Pokémon
  const [loading, setLoading] = useState(true); // Chargement en cours ?
  const [error, setError] = useState(null); // Message d'erreur éventuel
  const [selectedType, setSelectedType] = useState(null); // Type sélectionné pour le filtre
  const [searchQuery, setSearchQuery] = useState(''); // Recherche texte
  const [minPrice, setMinPrice] = useState(''); // Prix minimum sélectionné
  const [maxPrice, setMaxPrice] = useState(''); // Prix maximum sélectionné
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // Filtre de disponibilité ('all','available','unavailable','owned')

  // Types de Pokémon disponibles pour le filtre
  const pokemonTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice', 
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 
    'rock', 'ghost', 'dragon', 'steel', 'fairy'
  ];

  // Liste des pokémons déjà possédés par l'utilisateur (pour le filtre "possédés")
  const ownedIds = user?.pokemons?.map(p => p._id) || [];

  // Calcul de la plage globale de prix à partir de tous les Pokémon (utile pour le slider de prix)
  const prices = pokemons.map(p => p.price);
  const globalMinPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const globalMaxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  // Récupère tous les Pokémon au chargement de la page
  useEffect(() => {
    getAllPokemons()
      .then(response => {
        // Vérifie que la réponse est bien un tableau (sécurité)
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

  // Filtrage des Pokémon selon les filtres sélectionnés
  const filteredPokemons = pokemons.filter(pokemon => {
    // Filtre par type (si aucun type sélectionné, on garde tout)
    const matchesType = !selectedType ||
      pokemon.types.map(type => type.toLowerCase()).includes(selectedType);
    // Filtre par recherche texte (anglais ou français)
    const matchesSearch = !searchQuery ||
      pokemon.name.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pokemon.name.french.toLowerCase().includes(searchQuery.toLowerCase());
    // Filtre par prix (min et max)
    const matchesPrice =
      (minPrice === '' || pokemon.price >= Number(minPrice)) &&
      (maxPrice === '' || pokemon.price <= Number(maxPrice));
    // Filtre par disponibilité (logique différente selon le filtre choisi)
    let matchesAvailability = true;
    if (availabilityFilter === 'available') {
      // Affiche uniquement les Pokémon que l'utilisateur peut acheter et ne possède pas
      matchesAvailability = user && user.orbes >= pokemon.price && !ownedIds.includes(pokemon._id);
    } else if (availabilityFilter === 'unavailable') {
      // Affiche uniquement les Pokémon trop chers pour l'utilisateur et non possédés
      matchesAvailability = user && user.orbes < pokemon.price && !ownedIds.includes(pokemon._id);
    } else if (availabilityFilter === 'owned') {
      // Affiche uniquement les Pokémon déjà possédés
      matchesAvailability = ownedIds.includes(pokemon._id);
    }
    // On retourne true si le Pokémon passe tous les filtres
    return matchesType && matchesSearch && matchesPrice && matchesAvailability;
  });

  // Fonction pour gérer l'achat d'un Pokémon
  const handleBuy = async (pokemon) => {
    // Restriction pour les administrateurs (ils ne peuvent pas acheter)
    if (user && user.role === 'admin') {
      alert("Vous êtes administrateur et ne pouvez pas acheter de Pokémon.");
      return;
    }
    // Si l'utilisateur n'est pas connecté, on l'invite à se connecter
    if (!user) {
      const goLogin = window.confirm(
        "Vous devez être connecté pour acheter le pokémon."
      );
      if (goLogin) navigate('/login');
      return;
    }
    try {
      // Appel API pour acheter le Pokémon (retourne les orbes et la nouvelle liste de Pokémon)
      const data = await buyPokemon(pokemon.id, user.token);
      // Met à jour l'utilisateur avec les nouvelles infos
      updateUser({ ...user, orbes: data.orbes, pokemons: data.pokemons });
      alert('Pokémon acheté avec succès !');
    } catch (err) {
      alert(err.message || 'Erreur lors de l\'achat du Pokémon');
    }
  };

  // Affichage d'un message de chargement ou d'erreur si besoin
  if (loading) return <div className="loading">Chargement des Pokémon...</div>;
  if (error) return <div className="error">Erreur : {error}</div>;

  return (
    <div className="home-container">
      {/* Section d'introduction avec bonus d'inscription */}
      <section className="intro-section">
        <h2>Bienvenue dans le monde des Pokémon</h2>
        <p>
          Explorez notre Pokédex complet et découvrez des informations détaillées sur chaque Pokémon.
          Que vous soyez un dresseur débutant ou un expert, vous trouverez ici tout ce dont vous avez besoin.
        </p>
        {/* Affichage du bonus d'orbes pour les non-admins */}
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

      {/* Section de filtrage et recherche (type, recherche, prix, disponibilité) */}
      <section className="filter-section">
        <div className="filter-search-container">
          {/* Filtre par type de Pokémon */}
          <div className="filter-container">
            <h3>Filtrer par type</h3>
            <div className="type-filters">
              {/* Bouton pour afficher tous les types */}
              <button 
                className={`type-button ${selectedType === null ? 'active' : ''}`}
                onClick={() => setSelectedType(null)}
              >
                Tous
              </button>
              {/* Boutons pour chaque type de Pokémon */}
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
          {/* Barre de recherche par nom */}
          <div className="search-container">
            <h3>Rechercher un Pokémon</h3>
            <Search onSearch={setSearchQuery} />
          </div>
          {/* Slider de filtre de prix */}
          <PriceFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinChange={setMinPrice}
            onMaxChange={setMaxPrice}
            globalMin={globalMinPrice}
            globalMax={globalMaxPrice}
          />
          {/* Filtre de disponibilité (tous, achetables, non achetables, possédés) */}
          <AvailabilityFilter
            value={availabilityFilter}
            onChange={setAvailabilityFilter}
          />
        </div>
      </section>

      {/* Section d'affichage des Pokémon filtrés */}
      <section id="pokemon-section" className="pokemon-section">
        <div className="section-header">
          <h3>{selectedType ? `Pokémon de type ${selectedType}` : 'Tous les Pokémon'}</h3>
          {/* Bouton de création visible uniquement pour l'admin */}
          {user && user.role === 'admin' && (
            <button className="create-button" onClick={() => navigate('/create')}>
              Créer un nouveau Pokémon
            </button>
          )}
        </div>
        
        <div className="pokemon-grid">
          {/* Affichage des cartes Pokémon filtrées */}
          {filteredPokemons.length > 0 ? (
            filteredPokemons.map((pokemon) => {
              // Vérifie si le Pokémon est possédé par l'utilisateur
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