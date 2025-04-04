import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPokemonById, updatePokemon } from '../services/api';

const EditPokemonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editedPokemon, setEditedPokemon] = useState({
    id: '',
    name: { english: '', japanese: '', chinese: '', french: '' },
    type: '',
    base: { HP: '', Attack: '', Defense: '', 'Sp. Attack': '', 'Sp. Defense': '', Speed: '' },
    image: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await getPokemonById(id);
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

    const updatedPokemonData = {
      id: Number(editedPokemon.id), // Convert ID to number
      name: editedPokemon.name,
      type: editedPokemon.type.split(',').map((item) => item.trim()),
      base: editedPokemon.base,
      image: editedPokemon.image,
    };

    try {
      await updatePokemon(editedPokemon.id, updatedPokemonData);
      navigate(`/pokemons/${editedPokemon.id}`); // Redirect to the detail page
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

  return (
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
      <button type="button" onClick={() => navigate(`/pokemons/${id}`)}>Cancel</button>
    </form>
  );
};

export default EditPokemonPage;