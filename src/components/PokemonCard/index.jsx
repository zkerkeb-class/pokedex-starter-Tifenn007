import { Link, useNavigate } from 'react-router-dom';
import Orbes from '../../assets/orbes.png';
import './index.css';

// Composant qui affiche une carte de Pokémon avec ses infos et actions d'achat/vente
function PokemonCard({
  pokemon,      // Objet Pokémon à afficher
  isOwned,      // Booléen : l'utilisateur possède-t-il ce Pokémon ?
  isAdmin,      // Booléen : l'utilisateur est-il admin ?
  user,         // Utilisateur connecté
  handleBuy,    // Fonction pour acheter le Pokémon
  handleSell,   // Fonction pour vendre le Pokémon (optionnelle)
}) {
  const navigate = useNavigate(); // Pour rediriger si besoin

  return (
    <div className="pokemon-card">
      {/* Lien vers la page de détails du Pokémon */}
      <Link to={`/pokemons/${pokemon._id}`} className="pokemon-link" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
        <img src={pokemon.image} alt={pokemon.name.english} className="pokemon-detail-image" />
        <div className="pokemon-info">
          <h2 className="pokemon-name">{pokemon.name.english}</h2>
          <div className="pokemon-types">
            {/* Affiche les types du Pokémon */}
            {pokemon.types && pokemon.types.map((type, index) => (
              <span key={index} className={`pokemon-type ${type.toLowerCase()}`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            ))}
          </div>
        </div>
      </Link>
      {/* Bouton d'achat si non admin et non possédé */}
      {!isAdmin && !isOwned && handleBuy && (
        <button
          className="buy-button"
          onClick={() => handleBuy(pokemon)}
          disabled={user && user.orbes < pokemon.price}
        >
          Acheter pour {pokemon.price} <img src={Orbes} alt="Orbes" style={{ width: '20px', verticalAlign: 'middle' }} />
        </button>
      )}
      {/* Bouton de vente si non admin et possédé */}
      {!isAdmin && isOwned && (
        <button
          className="sell-button"
          onClick={handleSell ? () => handleSell(pokemon) : () => navigate(`/profile/${user.username || user.user?.username}`)}
        >
          {handleSell ? (
            <>
              Vendre pour {Math.round(pokemon.price * 0.8)} <img src={Orbes} alt="Orbes" style={{ width: '20px', verticalAlign: 'middle' }} />
            </>
          ) : (
            'Vendre'
          )}
        </button>
      )}
    </div>
  );
}

export default PokemonCard;