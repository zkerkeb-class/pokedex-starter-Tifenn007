import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import OrbesCounter from '../components/OrbesCounter';
import './ProfilePage.css';
import { useParams, Link } from 'react-router-dom';
import { getCurrentUserData, sellPokemon } from '../services/api';
import authService from '../services/authService';
import Orbes from '../assets/orbes.png';

function ProfilePage() {
  const { username } = useParams();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('arsenal');
  const [arsenal, setArsenal] = useState([]);
  const [loadingArsenal, setLoadingArsenal] = useState(false);
  const [errorArsenal, setErrorArsenal] = useState(null);

  // Fonction pour vendre un Pokémon
  const handleSell = async (pokemon) => {
    const token = authService.getToken();
    try {
      const data = await sellPokemon(pokemon.id, token);
      // Met à jour le contexte utilisateur et l'arsenal affiché
      updateUser({ ...user, orbes: data.orbes, pokemons: data.pokemons });
      setArsenal(data.pokemons);
      alert('Pokémon vendu avec succès !');
    } catch (err) {
      alert(err.message || "Erreur lors de la vente du Pokémon");
    }
  };

  useEffect(() => {
    if (activeTab === 'arsenal') {
      const fetchArsenal = async () => {
        setLoadingArsenal(true);
        try {
          const token = authService.getToken();
          const data = await getCurrentUserData(token);
          setArsenal(data.pokemons);
        } catch (err) {
          setErrorArsenal(err.message || "Erreur lors de la récupération de l'arsenal");
        } finally {
          setLoadingArsenal(false);
        }
      };
      fetchArsenal();
    }
  }, [activeTab]);

  return (
    <div className="profile-container">
      <h2>Profil de {username}</h2>
      <OrbesCounter />
      <div className="tabs">
        <button
          className={activeTab === 'arsenal' ? 'active' : ''}
          onClick={() => setActiveTab('arsenal')}
        >
          Mon Arsenal
        </button>
        <button
          className={activeTab === 'profil' ? 'active' : ''}
          onClick={() => setActiveTab('profil')}
        >
          Mon Profil
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'arsenal' && (
          <div>
            <h3>Mon Arsenal de Pokémons</h3>
            {loadingArsenal ? (
              <p>Chargement de votre arsenal...</p>
            ) : errorArsenal ? (
              <p className="error">{errorArsenal}</p>
            ) : arsenal.length > 0 ? (
              <div className="pokemon-grid">
                {arsenal.map((pokemon) => {
                  const salePrice = Math.round(pokemon.price * 0.8);
                  return (
                    <div key={pokemon._id} className="pokemon-card">
                      <img src={pokemon.image} alt={pokemon.name.english} className="pokemon-image" />
                      <div className="pokemon-info">
                        <Link to={`/pokemons/${pokemon._id}`} className="pokemon-link">
                          <h2 className="pokemon-name">{pokemon.name.english}</h2>
                        </Link>
                        <div className="pokemon-types">
                          {pokemon.types.map((type, index) => (
                            <span key={index} className={`pokemon-type ${type.toLowerCase()}`}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </span>
                          ))}
                        </div>
                      </div>
                      {/* Bouton pour vendre uniquement dans l'arsenal */}
                      <button
                        className="sell-button"
                        onClick={() => handleSell(pokemon)}
                      >
                        Vendre pour {salePrice} <img src={Orbes} alt="Orbes" style={{ width: '20px', verticalAlign: 'middle' }} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>Vous n&apos;avez pas encore de Pokémon. Allez les acheter !</p>
            )}
          </div>
        )}
        {activeTab === 'profil' && (
          <div>
            <h3>Informations du profil</h3>
            <p>Email: {user.email}</p>
            <p>Nom d&apos;utilisateur: {user.username || user.user?.username}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage; 