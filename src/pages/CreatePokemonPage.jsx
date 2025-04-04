import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPokemon, getAllPokemons } from '../services/api';

const CreatePokemonPage = () => {
  const [formData, setFormData] = useState({
    id: '', // L'ID sera généré automatiquement
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
    image: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await getAllPokemons();
        console.log('API response:', response); // Ajoutez ce message de débogage
        const pokemons = response.pokemons; // Utilisez la propriété correcte
        const maxId = Math.max(...pokemons.map(pokemon => pokemon.id));
        setFormData(prevFormData => ({
          ...prevFormData,
          id: maxId + 1, // Générer un nouvel ID
        }));
      } catch (error) {
        console.error('Error fetching pokemons:', error);
        setError('Failed to fetch Pokémon data.');
      }
    };

    fetchPokemons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Envoyer les données du formulaire à l'API
      await createPokemon(formData);
      navigate(`/pokemons/${formData.id}`);
    } catch (error) {
      console.error('Error creating pokemon:', error);
      setError('Failed to create Pokémon. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [field, subfield] = name.split('.'); // Handling nested fields like "base.HP"

    if (subfield) {
      setFormData((prevState) => ({
        ...prevState,
        [field]: {
          ...prevState[field],
          [subfield]: value
        }
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [field]: value
      }));
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
          readOnly
        />

        <h2>Names</h2>
        <input
          type="text"
          placeholder="English Name"
          name="name.english"
          value={formData.name.english}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Japanese Name"
          name="name.japanese"
          value={formData.name.japanese}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Chinese Name"
          name="name.chinese"
          value={formData.name.chinese}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="French Name"
          name="name.french"
          value={formData.name.french}
          onChange={handleInputChange}
        />

        <h2>Types</h2>
        <input
          type="text"
          placeholder="Type (comma-separated, e.g., Grass,Poison)"
          name="type"
          value={formData.type.join(',')}
          onChange={(e) =>
            setFormData({
              ...formData,
              type: e.target.value.split(',').map((item) => item.trim()),
            })
          }
        />

        <h2>Base Stats</h2>
        <input
          type="number"
          placeholder="HP"
          name="base.HP"
          value={formData.base.HP}
          onChange={handleInputChange}
        />
        <input
          type="number"
          placeholder="Attack"
          name="base.Attack"
          value={formData.base.Attack}
          onChange={handleInputChange}
        />
        <input
          type="number"
          placeholder="Defense"
          name="base.Defense"
          value={formData.base.Defense}
          onChange={handleInputChange}
        />
        <input
          type="number"
          placeholder="Sp. Attack"
          name="base['Sp. Attack']"
          value={formData.base['Sp. Attack']}
          onChange={handleInputChange}
        />
        <input
          type="number"
          placeholder="Sp. Defense"
          name="base['Sp. Defense']"
          value={formData.base['Sp. Defense']}
          onChange={handleInputChange}
        />
        <input
          type="number"
          placeholder="Speed"
          name="base.Speed"
          value={formData.base.Speed}
          onChange={handleInputChange}
        />

        <h2>Image URL</h2>
        <input
          type="text"
          placeholder="Image URL"
          name="image"
          value={formData.image}
          onChange={handleInputChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </button>
        <button type="button" onClick={() => navigate(`/`)}>Cancel</button>
  
      </form>
    </div>
  );
};

export default CreatePokemonPage;