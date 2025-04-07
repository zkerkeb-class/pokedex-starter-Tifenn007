import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPokemon, getAllPokemons } from '../services/api';

const CreatePokemonPage = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: {
      english: '',
      japanese: '',
      chinese: '',
      french: '',
    },
    types: [],
    stats: {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
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
        const pokemons = response.pokemons;
        const maxId = Math.max(...pokemons.map(p => p.id));
        setFormData(prev => ({
          ...prev,
          id: maxId + 1,
        }));
      } catch (error) {
        console.error('Erreur fetch pokémons :', error);
        setError("Impossible de récupérer les pokémons");
      }
    };

    fetchPokemons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createPokemon(formData);
      navigate(`/pokemons/${formData.id}`);
    } catch (error) {
      console.error('Erreur création Pokémon :', error);
      setError('Échec lors de la création du Pokémon');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('name.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        name: { ...prev.name, [key]: value },
      }));
    } else if (name.startsWith('stats.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        stats: { ...prev.stats, [key]: Number(value) },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div>
      <h1>Créer un Pokémon</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <h2>ID</h2>
        <input type="number" value={formData.id} readOnly />

        <h2>Noms</h2>
        {['english', 'japanese', 'chinese', 'french'].map((lang) => (
          <input
            key={lang}
            type="text"
            placeholder={`Nom en ${lang}`}
            name={`name.${lang}`}
            value={formData.name[lang]}
            onChange={handleInputChange}
          />
        ))}

        <h2>Types</h2>
        <input
          type="text"
          name="types"
          placeholder="ex: Grass, Poison"
          value={formData.types.join(',')}
          onChange={(e) =>
            setFormData({
              ...formData,
              types: e.target.value.split(',').map(t => t.trim()),
            })
          }
        />

        <h2>Stats</h2>
        <input
          type="number"
          name="stats.hp"
          placeholder="HP"
          value={formData.stats.hp}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="stats.attack"
          placeholder="Attack"
          value={formData.stats.attack}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="stats.defense"
          placeholder="Defense"
          value={formData.stats.defense}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="stats.specialAttack"
          placeholder="Special Attack"
          value={formData.stats.specialAttack}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="stats.specialDefense"
          placeholder="Special Defense"
          value={formData.stats.specialDefense}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="stats.speed"
          placeholder="Speed"
          value={formData.stats.speed}
          onChange={handleInputChange}
        />

        <h2>Image</h2>
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleInputChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Création en cours...' : 'Créer'}
        </button>
        <button type="button" onClick={() => navigate('/')}>Annuler</button>
      </form>
    </div>
  );
};

export default CreatePokemonPage;
