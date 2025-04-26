import { Link, useNavigate } from 'react-router-dom';
import Orbes from '../../assets/orbes.png';
import './index.css';

function PokemonCard({
  pokemon,
  isOwned,
  isAdmin,
  user,
  handleBuy,
}) {
  const navigate = useNavigate();

  return (
    <div className="pokemon-card">
      <img src={pokemon.image} alt={pokemon.name.english} className="pokemon-image" />
      <div className="pokemon-info">
        <Link to={`/pokemons/${pokemon._id}`} className="pokemon-link">
          <h2 className="pokemon-name">{pokemon.name.english}</h2>
        </Link>
        <div className="pokemon-types">
          {pokemon.types && pokemon.types.map((type, index) => (
            <span key={index} className={`pokemon-type ${type.toLowerCase()}`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          ))}
        </div>
      </div>
      {!isAdmin && !isOwned && (
        <button
          className="buy-button"
          onClick={() => handleBuy(pokemon)}
          disabled={user && user.orbes < pokemon.price}
        >
          Acheter pour {pokemon.price} <img src={Orbes} alt="Orbes" style={{ width: '20px', verticalAlign: 'middle' }} />
        </button>
      )}
      {!isAdmin && isOwned && (
        <button
          className="sell-button"
          onClick={() => navigate(`/profile/${user.username || user.user?.username}`)}
        >
          Vendre
        </button>
      )}
    </div>
  );
}

export default PokemonCard;