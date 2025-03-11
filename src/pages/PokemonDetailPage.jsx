import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPokemonById, deletePokemon, updatePokemon } from '../services/api';

const PokemonDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedPokemon, setEditedPokemon] = useState({
    id: '',
    name: { english: '', japanese: '', chinese: '', french: '' },
    type: '',
    base: { HP: '', Attack: '', Defense: '', 'Sp. Attack': '', 'Sp. Defense': '', Speed: '' },
    image: ''
  });

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await getPokemonById(id);
        console.log('pokemon data:', response);
        setPokemon(response.pokemon);
        setEditedPokemon({
          id: response.pokemon.id,
          name: response.pokemon.name,
          type: response.pokemon.type.join(', '),
          base: response.pokemon.base,
          image: response.pokemon.image
        });
      } catch (error) {
        console.error(`Error fetching pokemon with id ${id}:`, error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deletePokemon(id);
      navigate('/');
    } catch (error) {
      console.error(`Error deleting pokemon with id ${id}:`, error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    const [field, subfield] = name.split('.'); // Handling nested fields like "base.HP"

    if (subfield) {
      setEditedPokemon((prevState) => ({
        ...prevState,
        [field]: {
          ...prevState[field],
          [subfield]: value
        }
      }));
    } else {
      setEditedPokemon((prevState) => ({
        ...prevState,
        [field]: value
      }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Préparer les données modifiées dans l'ordre exact que tu as demandé
    const updatedPokemonData = {
      id: editedPokemon.id,  // Toujours envoyer l'id
      name: editedPokemon.name,  // Garder la structure du nom
      type: editedPokemon.type.split(',').map((item) => item.trim()), // Séparer les types par des virgules
      base: editedPokemon.base,  // Garder la structure des stats de base
      image: editedPokemon.image || pokemon.image,  // Garder l'image existante si elle n'est pas modifiée
    };

    try {
      const updatedPokemon = await updatePokemon(editedPokemon.id, updatedPokemonData);
      setPokemon(updatedPokemon); // Met à jour l'état du Pokémon avec les nouvelles données
      setEditing(false);
    } catch (error) {
      console.error('Error updating pokemon:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!pokemon) {
    return <div>Pokémon not found.</div>;
  }

  return (
    <div>
      {!editing ? (
        <>
          <h1>{pokemon.name?.english || 'Unknown'}</h1>
          <p>Japan: {pokemon.name?.japanese || 'Unknown'}</p>
          <p>Chinese: {pokemon.name?.chinese || 'Unknown'}</p>
          <p>French: {pokemon.name?.french || 'Unknown'}</p>
          <img src={pokemon.image || '/default-image.png'} alt={pokemon.name?.english || 'Pokemon'} />
          <p>Type: {Array.isArray(pokemon.type) ? pokemon.type.join(', ') : 'Unknown'}</p>
          <p>HP: {pokemon.base?.HP || 'Unknown'}</p>
          <p>Attack: {pokemon.base?.Attack || 'Unknown'}</p>
          <p>Defense: {pokemon.base?.Defense || 'Unknown'}</p>
          <p>Sp. Attack: {pokemon.base?.['Sp. Attack'] || 'Unknown'}</p>
          <p>Sp. Defense: {pokemon.base?.['Sp. Defense'] || 'Unknown'}</p>
          <p>Speed: {pokemon.base?.Speed || 'Unknown'}</p>
          <button onClick={handleDelete}>Delete Pokémon</button>
          <button onClick={() => setEditing(true)}>Edit Pokémon</button>
        </>
      ) : (
        <form onSubmit={handleEditSubmit}>
          <h1>Edit Pokémon</h1>

          {/* ID Input */}
          <label>
            ID:
            <input
              type="number"
              name="id"
              value={editedPokemon.id || ''}
              onChange={handleEditChange}
            />
          </label>

          {/* Name Inputs */}
          <label>
            English Name:
            <input
              type="text"
              name="name.english"
              value={editedPokemon.name?.english || ''}
              onChange={handleEditChange}
            />
          </label>

          <label>
            Japanese Name:
            <input
              type="text"
              name="name.japanese"
              value={editedPokemon.name?.japanese || ''}
              onChange={handleEditChange}
            />
          </label>

          <label>
            Chinese Name:
            <input
              type="text"
              name="name.chinese"
              value={editedPokemon.name?.chinese || ''}
              onChange={handleEditChange}
            />
          </label>

          <label>
            French Name:
            <input
              type="text"
              name="name.french"
              value={editedPokemon.name?.french || ''}
              onChange={handleEditChange}
            />
          </label>

          {/* Type Input */}
          <label>
            Type:
            <input
              type="text"
              name="type"
              value={editedPokemon.type || ''}
              onChange={handleEditChange}
            />
          </label>

          {/* Image URL Input */}
          <label>
            Image URL:
            <input
              type="text"
              name="image"
              value={editedPokemon.image || ''}
              onChange={handleEditChange}
            />
          </label>

          {/* Stats Inputs */}
          <label>
            HP:
            <input
              type="number"
              name="base.HP"
              value={editedPokemon.base?.HP || ''}
              onChange={handleEditChange}
            />
          </label>

          <label>
            Attack:
            <input
              type="number"
              name="base.Attack"
              value={editedPokemon.base?.Attack || ''}
              onChange={handleEditChange}
            />
          </label>

          <label>
            Defense:
            <input
              type="number"
              name="base.Defense"
              value={editedPokemon.base?.Defense || ''}
              onChange={handleEditChange}
            />
          </label>

          <label>
            Sp. Attack:
            <input
              type="number"
              name="base.Sp. Attack"
              value={editedPokemon.base?.['Sp. Attack'] || ''}
              onChange={handleEditChange}
            />
          </label>

          <label>
            Sp. Defense:
            <input
              type="number"
              name="base.Sp. Defense"
              value={editedPokemon.base?.['Sp. Defense'] || ''}
              onChange={handleEditChange}
            />
          </label>

          <label>
            Speed:
            <input
              type="number"
              name="base.Speed"
              value={editedPokemon.base?.Speed || ''}
              onChange={handleEditChange}
            />
          </label>

          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default PokemonDetailPage;
