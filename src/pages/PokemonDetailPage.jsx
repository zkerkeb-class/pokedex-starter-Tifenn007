import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPokemonById, deletePokemon } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
    <>
      
      <h1>{pokemon.name?.english || 'Inconnu'}</h1>
      <p>Japonais : {pokemon.name?.japanese || 'Inconnu'}</p>
      <p>Chinois : {pokemon.name?.chinese || 'Inconnu'}</p>
      <p>Français : {pokemon.name?.french || 'Inconnu'}</p>
      <img src={pokemon.image || '/default-image.png'} alt={pokemon.name?.english || 'Pokemon'} />
      <p>Type : {Array.isArray(pokemon.types) ? pokemon.types.join(', ') : 'Inconnu'}</p>
      <p>HP : {pokemon.stats?.hp || 'Inconnu'}</p>
      <p>Attaque : {pokemon.stats?.attack || 'Inconnu'}</p>
      <p>Défense : {pokemon.stats?.defense || 'Inconnu'}</p>
      <p>Attaque Spéciale : {pokemon.stats?.specialAttack || 'Inconnu'}</p>
      <p>Défense Spéciale : {pokemon.stats?.specialDefense || 'Inconnu'}</p>
      <p>Vitesse : {pokemon.stats?.speed || 'Inconnu'}</p>
       {user && user.role === 'admin' && ( // Vérifiez si l'utilisateur est admin
        <>
          <button onClick={handleDelete}>Supprimer le Pokémon</button>
          <button onClick={() => navigate(`/edit/${paramId}`)}>Modifier le Pokémon</button>
        </>
      )}
      <button type="button" onClick={() => navigate(`/`)}>Annuler</button>
    </>
  );
};

export default PokemonDetailPage;