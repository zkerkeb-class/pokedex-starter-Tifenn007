import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPokemon, getAllPokemons } from '../services/api';

const CreatePokemonPage = () => {
  const [formData, setFormData] = useState({
    id: '', // L'ID sera saisi par l'utilisateur
    name: {
      english: '',
      japanese: '',
      chinese: '',
      french: '',
    },
    type: [],
    base: {
      HP: 0,
      Attack: 0,
      Defense: 0,
      'Sp. Attack': 0,
      'Sp. Defense': 0,
      Speed: 0,
    },
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation de l'ID
    if (!formData.id || isNaN(formData.id)) {
      setError('Please enter a valid ID (must be a number).');
      setLoading(false);
      return;
    }

    try {
      // Vérifier si l'ID existe déjà
      const response = await getAllPokemons();
      console.log('Pokemons:', response); // Afficher la réponse de getAllPokemons
      if (!Array.isArray(response.pokemon)) {
        throw new Error('Expected an array of Pokémon, but got something else.');
      }
      const idExists = response.pokemon.some((pokemon) => pokemon.id === parseInt(formData.id));
      if (idExists) {
        setError('This ID already exists. Please choose a different ID.');
        setLoading(false);
        return;
      }

      // Envoyer les données du formulaire à l'API
      console.log('Data being sent:', formData);
      await createPokemon(formData);
      navigate('/');
    } catch (error) {
      console.error('Error creating pokemon:', error);
      setError('Failed to create Pokémon. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Pokémon</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Champ de saisie pour l'ID */}
        <h2>ID</h2>
        <input
          type="number"
          placeholder="ID"
          value={formData.id}
          onChange={(e) =>
            setFormData({
              ...formData,
              id: e.target.value,
            })
          }
        />

        <h2>Names</h2>
        <input
          type="text"
          placeholder="English Name"
          value={formData.name.english}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: { ...formData.name, english: e.target.value },
            })
          }
        />
        <input
          type="text"
          placeholder="Japanese Name"
          value={formData.name.japanese}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: { ...formData.name, japanese: e.target.value },
            })
          }
        />
        <input
          type="text"
          placeholder="Chinese Name"
          value={formData.name.chinese}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: { ...formData.name, chinese: e.target.value },
            })
          }
        />
        <input
          type="text"
          placeholder="French Name"
          value={formData.name.french}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: { ...formData.name, french: e.target.value },
            })
          }
        />

        <h2>Types</h2>
        <input
          type="text"
          placeholder="Type (comma-separated, e.g., Grass,Poison)"
          value={formData.type.join(',')}
          onChange={(e) =>
            setFormData({
              ...formData,
              type: e.target.value.split(','),
            })
          }
        />

        <h2>Base Stats</h2>
        <input
          type="number"
          placeholder="HP"
          value={formData.base.HP}
          onChange={(e) =>
            setFormData({
              ...formData,
              base: { ...formData.base, HP: parseInt(e.target.value) },
            })
          }
        />
        <input
          type="number"
          placeholder="Attack"
          value={formData.base.Attack}
          onChange={(e) =>
            setFormData({
              ...formData,
              base: { ...formData.base, Attack: parseInt(e.target.value) },
            })
          }
        />
        <input
          type="number"
          placeholder="Defense"
          value={formData.base.Defense}
          onChange={(e) =>
            setFormData({
              ...formData,
              base: { ...formData.base, Defense: parseInt(e.target.value) },
            })
          }
        />
        <input
          type="number"
          placeholder="Sp. Attack"
          value={formData.base['Sp. Attack']}
          onChange={(e) =>
            setFormData({
              ...formData,
              base: { ...formData.base, 'Sp. Attack': parseInt(e.target.value) },
            })
          }
        />
        <input
          type="number"
          placeholder="Sp. Defense"
          value={formData.base['Sp. Defense']}
          onChange={(e) =>
            setFormData({
              ...formData,
              base: { ...formData.base, 'Sp. Defense': parseInt(e.target.value) },
            })
          }
        />
        <input
          type="number"
          placeholder="Speed"
          value={formData.base.Speed}
          onChange={(e) =>
            setFormData({
              ...formData,
              base: { ...formData.base, Speed: parseInt(e.target.value) },
            })
          }
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default CreatePokemonPage;