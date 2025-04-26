import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPokemonById, updatePokemon } from '../services/api';
import { useAuth } from '../context/AuthContext';

const allTypes = [
  'normal','fire','water','electric','grass','ice',
  'fighting','poison','ground','flying','psychic','bug',
  'rock','ghost','dragon','steel','fairy'
];

const EditPokemonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editedPokemon, setEditedPokemon] = useState({
    id: '',
    name: { english: '', japanese: '', chinese: '', french: '' },
    types: [],
    stats: {
      hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0
    },
    price: 0,
    evolutions: [],
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await getPokemonById(id);
        setEditedPokemon({
          id: response.id,
          name: response.name,
          types: response.types || [],
          stats: response.stats,
          price: response.price,
          evolutions: response.evolutions || [],
          image: response.image
        });
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemon();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('name.')) {
      const key = name.split('.')[1];
      setEditedPokemon(prev => ({
        ...prev,
        name: { ...prev.name, [key]: value }
      }));
    } else if (name.startsWith('stats.')) {
      const key = name.split('.')[1];
      setEditedPokemon(prev => ({
        ...prev,
        stats: { ...prev.stats, [key]: Number(value) }
      }));
    } else if (name === 'price') {
      setEditedPokemon(prev => ({ ...prev, price: Number(value) }));
    } else {
      setEditedPokemon(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTypeCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setEditedPokemon(prev => {
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    let payload;
    if (imageFile) {
      payload = new FormData();
      payload.append('id', editedPokemon.id);
      payload.append('name', JSON.stringify(editedPokemon.name));
      editedPokemon.types.forEach(type => payload.append('types', type));
      payload.append('stats', JSON.stringify(editedPokemon.stats));
      payload.append('price', editedPokemon.price);
      editedPokemon.evolutions.forEach(evo => payload.append('evolutions', evo));
      payload.append('image', imageFile);
    } else {
      payload = {
        id: editedPokemon.id,
        name: editedPokemon.name,
        types: editedPokemon.types,
        stats: editedPokemon.stats,
        price: editedPokemon.price,
        evolutions: editedPokemon.evolutions,
        image: editedPokemon.image
      };
    }
    try {
      await updatePokemon(id, payload, user?.token);
      navigate(`/pokemons/${id}`);
    } catch (error) {
      setError(error);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message}</div>;

  return (
    <form onSubmit={handleEditSubmit} encType="multipart/form-data">
      <h1>Modifier le Pokémon</h1>
      <label>ID :</label>
      <input type="number" name="id" value={editedPokemon.id} readOnly />

      <h2>Noms</h2>
      {['english', 'japanese', 'chinese', 'french'].map((lang) => (
        <input
          key={lang}
          type="text"
          placeholder={`Nom en ${lang}`}
          name={`name.${lang}`}
          value={editedPokemon.name[lang]}
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
              checked={editedPokemon.types.includes(type)}
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
        value={editedPokemon.stats.hp}
        onChange={handleInputChange}
      />
      <label htmlFor="stats-attack">Attack</label>
      <input
        id="stats-attack"
        type="number"
        name="stats.attack"
        placeholder="Attack"
        min="0"
        value={editedPokemon.stats.attack}
        onChange={handleInputChange}
      />
      <label htmlFor="stats-defense">Defense</label>
      <input
        id="stats-defense"
        type="number"
        name="stats.defense"
        placeholder="Defense"
        min="0"
        value={editedPokemon.stats.defense}
        onChange={handleInputChange}
      />
      <label htmlFor="stats-specialAttack">Special Attack</label>
      <input
        id="stats-specialAttack"
        type="number"
        name="stats.specialAttack"
        placeholder="Special Attack"
        min="0"
        value={editedPokemon.stats.specialAttack}
        onChange={handleInputChange}
      />
      <label htmlFor="stats-specialDefense">Special Defense</label>
      <input
        id="stats-specialDefense"
        type="number"
        name="stats.specialDefense"
        placeholder="Special Defense"
        min="0"
        value={editedPokemon.stats.specialDefense}
        onChange={handleInputChange}
      />
      <label htmlFor="stats-speed">Speed</label>
      <input
        id="stats-speed"
        type="number"
        name="stats.speed"
        placeholder="Speed"
        min="0"
        value={editedPokemon.stats.speed}
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
        value={editedPokemon.price}
        onChange={handleInputChange}
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
      {!imageFile && editedPokemon.image && (
        <img
          src={editedPokemon.image}
          alt="Actuelle"
          style={{ maxWidth: '200px', marginTop: '0.5rem' }}
        />
      )}

      <button type="submit">Mettre à jour</button>
      <button type="button" onClick={() => navigate(`/pokemons/${id}`)}>Annuler</button>
    </form>
  );
};

export default EditPokemonPage;
