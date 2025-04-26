import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPokemon, getAllPokemons } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
    price: 0,
    evolutions: [],
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageFile, setImageFile] = useState(null);

  // Liste des types disponibles
  const allTypes = [
    'normal','fire','water','electric','grass','ice',
    'fighting','poison','ground','flying','psychic','bug',
    'rock','ghost','dragon','steel','fairy'
  ];

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        // getAllPokemons renvoie directement un tableau
        const pokemons = await getAllPokemons();
        const maxId = pokemons.length > 0 ? Math.max(...pokemons.map(p => p.id)) : 0;
        setFormData(prev => ({
          ...prev,
          id: maxId + 1,
        }));
      } catch (error) {
        console.error('Erreur fetch pokémons :', error);
        // Définir un id par défaut si l'API n'est pas accessible
        setFormData(prev => ({ ...prev, id: 1 }));
        // On ne définit pas d'erreur pour éviter l'affichage
      }
    };

    fetchPokemons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = user?.token;
      // Préparer FormData si une image est sélectionnée
      const payload = imageFile
        ? new FormData()
        : formData;
      if (imageFile) {
        payload.append('image', imageFile);
        payload.append('id', formData.id);
        payload.append('name', JSON.stringify(formData.name));
        formData.types.forEach(type => payload.append('types', type));
        payload.append('stats', JSON.stringify(formData.stats));
        payload.append('price', formData.price);
        formData.evolutions.forEach(evo => payload.append('evolutions', evo));
      }
      const newPokemon = await createPokemon(payload, token);
      navigate(`/pokemons/${newPokemon._id}`);
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

  // Handler pour les cases à cocher des types
  const handleTypeCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const types = checked
        ? [...prev.types, value]
        : prev.types.filter(t => t !== value);
      return { ...prev, types };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  return (
    <div>
      <h1>Créer un Pokémon</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {allTypes.map(type => (
            <label key={type} style={{ marginRight: '1rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="types"
                value={type}
                checked={formData.types.includes(type)}
                onChange={handleTypeCheckboxChange}
              />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>

        <h2>Stats</h2>
        <label htmlFor="stats-hp">HP</label>
        <input
          id="stats-hp"
          type="number"
          name="stats.hp"
          placeholder="HP"
          min="0"
          value={formData.stats.hp}
          onChange={handleInputChange}
        />
        <label htmlFor="stats-attack">Attack</label>
        <input
          id="stats-attack"
          type="number"
          name="stats.attack"
          placeholder="Attack"
          min="0"
          value={formData.stats.attack}
          onChange={handleInputChange}
        />
        <label htmlFor="stats-defense">Defense</label>
        <input
          id="stats-defense"
          type="number"
          name="stats.defense"
          placeholder="Defense"
          min="0"
          value={formData.stats.defense}
          onChange={handleInputChange}
        />
        <label htmlFor="stats-specialAttack">Special Attack</label>
        <input
          id="stats-specialAttack"
          type="number"
          name="stats.specialAttack"
          placeholder="Special Attack"
          min="0"
          value={formData.stats.specialAttack}
          onChange={handleInputChange}
        />
        <label htmlFor="stats-specialDefense">Special Defense</label>
        <input
          id="stats-specialDefense"
          type="number"
          name="stats.specialDefense"
          placeholder="Special Defense"
          min="0"
          value={formData.stats.specialDefense}
          onChange={handleInputChange}
        />
        <label htmlFor="stats-speed">Speed</label>
        <input
          id="stats-speed"
          type="number"
          name="stats.speed"
          placeholder="Speed"
          min="0"
          value={formData.stats.speed}
          onChange={handleInputChange}
        />

        <h2>Prix</h2>
        <label htmlFor="price">Prix</label>
        <input
          id="price"
          type="number"
          name="price"
          placeholder="Prix"
          min="0"
          value={formData.price}
          onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
        />

        <h2>Image</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            style={{ maxWidth: '200px', marginTop: '0.5rem' }}
          />
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Création en cours...' : 'Créer'}
        </button>
        <button type="button" onClick={() => navigate('/')}>Annuler</button>
      </form>
    </div>
  );
};

export default CreatePokemonPage;
