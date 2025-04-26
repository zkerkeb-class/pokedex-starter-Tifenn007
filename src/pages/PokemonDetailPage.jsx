import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPokemonById, deletePokemon } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './PokemonDetailPage.css';

const PokemonDetailPage = () => {
  const { id: paramId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        if (!paramId) {
          throw new Error('ID invalide');
        }
        const response = await getPokemonById(paramId);
        if (!response) {
          throw new Error('Pokémon introuvable');
        }
        setPokemon(response);
      } catch (error) {
        console.error(`Erreur lors de la récupération du Pokémon avec l'id ${paramId} :`, error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPokemon();
  }, [paramId]);

  const handleDelete = async () => {
    if (!window.confirm('Voulez-vous supprimer ce Pokémon ?')) return;
    try {
      await deletePokemon(paramId, user?.token);
      navigate('/');
    } catch (error) {
      console.error(`Erreur lors de la suppression du Pokémon avec l'id ${paramId} :`, error);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error.message}</div>;
  }

  if (!pokemon) {
    return <div>Pokémon introuvable.</div>;
  }

  return (
    <div className="pokemon-detail-card">
      <button className="close-btn" onClick={() => navigate(`/`)}>×</button>
      <div className="pokemon-detail-header">
        <img className="pokemon-detail-image" src={pokemon.image || '/default-image.png'} alt={pokemon.name?.english || 'Pokemon'} />
        <div className="pokemon-detail-names">
          <h1>{pokemon.name?.english || 'Inconnu'}</h1>
          <p>Français : {pokemon.name?.french || 'Inconnu'}</p>
          <p>Japonais : {pokemon.name?.japanese || 'Inconnu'}</p>
          <p>Chinois : {pokemon.name?.chinese || 'Inconnu'}</p>
        </div>
      </div>
      <div className="pokemon-detail-info">
        <div className="pokemon-detail-row">
          <span className="pokemon-detail-label">Type :</span>
          <div className="pokemon-detail-types">
            {Array.isArray(pokemon.types) ? pokemon.types.map((type, i) => (
              <span key={i} className={`pokemon-type ${type.toLowerCase()}`}>{type}</span>
            )) : 'Inconnu'}
          </div>
        </div>
        <div className="pokemon-detail-row">
          <span className="pokemon-detail-label">Statistiques :</span>
          <div className="pokemon-detail-stats">
            <div className="stat-row"><span>PV</span><div className="stat-bar"><div style={{width: `${pokemon.stats?.hp || 0}%`}} className="stat-fill hp"></div></div><span>{pokemon.stats?.hp || 0}</span></div>
            <div className="stat-row"><span>Attaque</span><div className="stat-bar"><div style={{width: `${pokemon.stats?.attack || 0}%`}} className="stat-fill attack"></div></div><span>{pokemon.stats?.attack || 0}</span></div>
            <div className="stat-row"><span>Défense</span><div className="stat-bar"><div style={{width: `${pokemon.stats?.defense || 0}%`}} className="stat-fill defense"></div></div><span>{pokemon.stats?.defense || 0}</span></div>
            <div className="stat-row"><span>Att. Spé.</span><div className="stat-bar"><div style={{width: `${pokemon.stats?.specialAttack || 0}%`}} className="stat-fill sp-attack"></div></div><span>{pokemon.stats?.specialAttack || 0}</span></div>
            <div className="stat-row"><span>Déf. Spé.</span><div className="stat-bar"><div style={{width: `${pokemon.stats?.specialDefense || 0}%`}} className="stat-fill sp-defense"></div></div><span>{pokemon.stats?.specialDefense || 0}</span></div>
            <div className="stat-row"><span>Vitesse</span><div className="stat-bar"><div style={{width: `${pokemon.stats?.speed || 0}%`}} className="stat-fill speed"></div></div><span>{pokemon.stats?.speed || 0}</span></div>
          </div>
        </div>
        <div className="pokemon-detail-row pokemon-detail-actions">
          {user && user.role === 'admin' && (
            <>
              <button className="admin-btn" onClick={handleDelete}>Supprimer</button>
              <button className="admin-btn" onClick={() => navigate(`/edit/${paramId}`)}>Modifier</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailPage;