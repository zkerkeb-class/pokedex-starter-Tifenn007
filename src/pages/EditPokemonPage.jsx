import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPokemonById, updatePokemon } from '../services/api';

const EditPokemonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editedPokemon, setEditedPokemon] = useState({
    id: '',
    name: { english: '', japanese: '', chinese: '', french: '' },
    types: '',
    stats: {
      hp: '',
      attack: '',
      defense: '',
      specialAttack: '',
      specialDefense: '',
      speed: ''
    },
    image: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await getPokemonById(id); // response est directement le pokemon
        setEditedPokemon({
          id: response.id,
          name: response.name,
          types: response.types.join(', '),
          stats: response.stats,
          image: response.image
        });
      } catch (error) {
        console.error(`Erreur lors de la récupération du Pokémon avec l'id ${id} :`, error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    const [field, subfield] = name.split('.');

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
      id: Number(editedPokemon.id),
      name: editedPokemon.name,
      types: editedPokemon.types.split(',').map((item) => item.trim()),
      stats: {
        hp: Number(editedPokemon.stats.hp),
        attack: Number(editedPokemon.stats.attack),
        defense: Number(editedPokemon.stats.defense),
        specialAttack: Number(editedPokemon.stats.specialAttack),
        specialDefense: Number(editedPokemon.stats.specialDefense),
        speed: Number(editedPokemon.stats.speed)
      },
      image: editedPokemon.image
    };

    try {
      await updatePokemon(id, updatedPokemonData);
      navigate(`/pokemons/${id}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du Pokémon :', error);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message}</div>;

  return (
    <form onSubmit={handleEditSubmit}>
      <h1>Modifier le Pokémon</h1>

      <label>ID :
        <input type="number" name="id" value={editedPokemon.id || ''} onChange={handleEditChange} />
      </label>

      <label>Nom (Anglais) :
        <input type="text" name="name.english" value={editedPokemon.name.english || ''} onChange={handleEditChange} />
      </label>

      <label>Nom (Japonais) :
        <input type="text" name="name.japanese" value={editedPokemon.name.japanese || ''} onChange={handleEditChange} />
      </label>

      <label>Nom (Chinois) :
        <input type="text" name="name.chinese" value={editedPokemon.name.chinese || ''} onChange={handleEditChange} />
      </label>

      <label>Nom (Français) :
        <input type="text" name="name.french" value={editedPokemon.name.french || ''} onChange={handleEditChange} />
      </label>

      <label>Types :
        <input type="text" name="types" value={editedPokemon.types || ''} onChange={handleEditChange} />
      </label>

      <label>Image :
        <input type="text" name="image" value={editedPokemon.image || ''} onChange={handleEditChange} />
      </label>

      <label>HP :
        <input type="number" name="stats.hp" value={editedPokemon.stats.hp || ''} onChange={handleEditChange} />
      </label>

      <label>Attaque :
        <input type="number" name="stats.attack" value={editedPokemon.stats.attack || ''} onChange={handleEditChange} />
      </label>

      <label>Défense :
        <input type="number" name="stats.defense" value={editedPokemon.stats.defense || ''} onChange={handleEditChange} />
      </label>

      <label>Attaque Spéciale :
        <input type="number" name="stats.specialAttack" value={editedPokemon.stats.specialAttack || ''} onChange={handleEditChange} />
      </label>

      <label>Défense Spéciale :
        <input type="number" name="stats.specialDefense" value={editedPokemon.stats.specialDefense || ''} onChange={handleEditChange} />
      </label>

      <label>Vitesse :
        <input type="number" name="stats.speed" value={editedPokemon.stats.speed || ''} onChange={handleEditChange} />
      </label>

      <button type="submit">Enregistrer</button>
      <button type="button" onClick={() => navigate(`/pokemons/${id}`)}>Annuler</button>
    </form>
  );
};

export default EditPokemonPage;
