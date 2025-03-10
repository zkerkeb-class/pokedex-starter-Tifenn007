import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPokemonById, updatePokemon } from '../services/api';

const EditPokemonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const data = await getPokemonById(id);
        setFormData({ name: data.name, description: data.description });
      } catch (error) {
        console.error(`Error fetching pokemon with id ${id}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePokemon(id, formData);
      navigate(`/pokemon/${id}`);
    } catch (error) {
      console.error(`Error updating pokemon with id ${id}:`, error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit Pokémon</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditPokemonPage;