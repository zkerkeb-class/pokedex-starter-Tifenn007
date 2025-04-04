import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPokemonById, deletePokemon } from '../services/api';

const PokemonDetailPage = () => {
  const { id: paramId } = useParams(); // Renommé pour plus de clarté
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
        setPokemon(response); // Assurez-vous que response contient les détails du Pokémon
        console.log("Détails du Pokémon :", response); // Debug : Affiche les infos du Pokémon
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
    try {
      await deletePokemon(paramId); // Utilisation de paramId
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
    <div>
      <h1>{pokemon.name?.english || 'Inconnu'}</h1>
      <p>Japonais : {pokemon.name?.japanese || 'Inconnu'}</p>
      <p>Chinois : {pokemon.name?.chinese || 'Inconnu'}</p>
      <p>Français : {pokemon.name?.french || 'Inconnu'}</p>
      <img src={pokemon.image || '/default-image.png'} alt={pokemon.name?.english || 'Pokemon'} />
      <p>Type : {Array.isArray(pokemon.type) ? pokemon.type.join(', ') : 'Inconnu'}</p>
      <p>HP : {pokemon.base?.HP || 'Inconnu'}</p>
      <p>Attaque : {pokemon.base?.Attack || 'Inconnu'}</p>
      <p>Défense : {pokemon.base?.Defense || 'Inconnu'}</p>
      <p>Attaque Spéciale : {pokemon.base?.['Sp. Attack'] || 'Inconnu'}</p>
      <p>Défense Spéciale : {pokemon.base?.['Sp. Defense'] || 'Inconnu'}</p>
      <p>Vitesse : {pokemon.base?.Speed || 'Inconnu'}</p>
      <button onClick={handleDelete}>Supprimer le Pokémon</button>
      <button onClick={() => navigate(`/edit/${paramId}`)}>Modifier le Pokémon</button>
      <button type="button" onClick={() => navigate(`/`)}>Annuler</button>
    </div>
  );
};

export default PokemonDetailPage;