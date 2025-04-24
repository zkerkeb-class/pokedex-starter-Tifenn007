import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import OrbesCounter from '../components/OrbesCounter';
import './ProfilePage.css';
import { useParams, Link } from 'react-router-dom';
import { getCurrentUserData, sellPokemon, getAllQuests, getQuestsStatus, createQuest, updateQuest, deleteQuest, claimDailyReward, deactivateQuest, activateQuest, claimQuestReward } from '../services/api';
import authService from '../services/authService';
import Orbes from '../assets/orbes.png';

function ProfilePage() {
  const { username } = useParams();
  const { user, updateUser, loading } = useAuth();
  const [arsenal, setArsenal] = useState([]);
  const [loadingArsenal, setLoadingArsenal] = useState(false);
  const [errorArsenal, setErrorArsenal] = useState(null);
  const [questsDef, setQuestsDef] = useState([]);
  const [questsStat, setQuestsStat] = useState({ dailyRewardClaimed: false, orbesReward: 10, quests: [] });
  const [loadingRewards, setLoadingRewards] = useState(false);
  const [errorRewards, setErrorRewards] = useState(null);
  const [activeTab, setActiveTab] = useState('arsenal');

  useEffect(() => {
    if (activeTab === 'arsenal') {
      setLoadingArsenal(true);
      getCurrentUserData(authService.getToken())
        .then(data => setArsenal(data.pokemons))
        .catch(err => setErrorArsenal(err.message))
        .finally(() => setLoadingArsenal(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'rewards') {
      setLoadingRewards(true);
      const token = authService.getToken();
      Promise.all([
        getQuestsStatus(token),
        getAllQuests(token),      // on charge désormais les définitions quel que soit le rôle
      ])
        .then(([stat, defs]) => {
          setQuestsStat(stat);
          setQuestsDef(defs);
        })
        .catch(err => setErrorRewards(err.message))
        .finally(() => setLoadingRewards(false));
    }
  }, [activeTab]);

  if (loading) return <div>Chargement du profil...</div>;
  if (!user) return <div>Utilisateur non trouvé</div>;

  const handleSell = async (pokemon) => {
    const token = authService.getToken();
    try {
      const data = await sellPokemon(pokemon.id, token);
      updateUser({ ...user, orbes: data.orbes, pokemons: data.pokemons });
      setArsenal(data.pokemons);
      alert('Pokémon vendu avec succès !');
    } catch (err) {
      alert(err.message || "Erreur lors de la vente du Pokémon");
    }
  };

  const handleDaily = async () => {
    try {
      const token = authService.getToken();
      const data = await claimDailyReward(token);
      updateUser({ ...user, orbes: data.orbes, lastDailyReward: data.lastDailyReward });
      alert(data.message);
    } catch (err) {
      alert(err.message || 'Impossible de réclamer la récompense journalière');
    }
  };

  const handleCreateQuest = async () => {
    const key = prompt('Clé unique (achat/vente/connexion) :');
    if (!key) return;
    const name = prompt('Nom de la quête :');
    const target = parseInt(prompt('Objectif (nombre) :', '1'), 10);
    const reward = parseInt(prompt('Récompense (Orbes) :', '10'), 10);
    const resetFrequency = prompt('Fréquence de reset (daily/weekly/never) :', 'never');
    try {
      const token = authService.getToken();
      await createQuest({ key, name, target, reward, resetFrequency }, token);
      const defs = await getAllQuests(token);
      setQuestsDef(defs);
      alert('Quête créée');
    } catch (err) {
      alert(err.message || 'Erreur création quête');
    }
  };

  const handleUpdateQuest = async (quest) => {
    const name = prompt('Nouveau nom :', quest.name);
    const target = parseInt(prompt('Nouvel objectif :', quest.target), 10);
    const reward = parseInt(prompt('Nouvelle récompense :', quest.reward), 10);
    const resetFrequency = prompt('Fréquence reset :', quest.resetFrequency);
    try {
      const token = authService.getToken();
      await updateQuest(quest._id, { key: quest.key, name, target, reward, resetFrequency }, token);
      const defs = await getAllQuests(token);
      setQuestsDef(defs);
      alert('Quête mise à jour');
    } catch (err) {
      alert(err.message || 'Erreur mise à jour quête');
    }
  };

  const handleDeleteQuest = async (id) => {
    if (!window.confirm('Confirmez-vous la suppression de cette quête ?')) return;
    try {
      const token = authService.getToken();
      await deleteQuest(id, token);
      const defs = await getAllQuests(token);
      setQuestsDef(defs);
      alert('Quête supprimée');
    } catch (err) {
      alert(err.message || 'Erreur suppression quête');
    }
  };

  const toggleQuestActive = async (id, active) => {
    try {
      const token = authService.getToken();
      if (active) {
        await deactivateQuest(id, token);
      } else {
        await activateQuest(id, token);
      }
      const defs = await getAllQuests(token);
      setQuestsDef(defs);
    } catch (err) {
      alert(err.message || 'Erreur mise à jour statut de quête');
    }
  };

  const handleClaimQuest = async (questId) => {
    const token = authService.getToken();
    try {
      const data = await claimQuestReward(questId, token);
      updateUser({ ...user, orbes: data.orbes });
      const stat = await getQuestsStatus(token);
      setQuestsStat(stat);
    } catch (err) {
      if (err.response?.status === 400) {
        const stat = await getQuestsStatus(token);
        setQuestsStat(stat);
      } else {
        console.error('Erreur récupération récompense', err);
      }
    }
  };

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
        <button
          className={activeTab === 'rewards' ? 'active' : ''}
          onClick={() => setActiveTab('rewards')}
        >
          Récompenses
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
              <p>Vous n&apos;avez pas de Pokémon dans votre arsenal. Allez les acheter !</p>
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
        {activeTab === 'rewards' && (
          <div className="rewards-section">
            <h3>Récompenses</h3>
            {loadingRewards ? (
              <p>Chargement des récompenses...</p>
            ) : errorRewards ? (
              <p className="error">{errorRewards}</p>
            ) : (
              <>
                {user?.role !== 'admin' && (
                  <section className="daily">
                    <h4>Récompense journalière (+{questsStat.orbesReward} Orbes)</h4>
                    {questsStat.dailyRewardClaimed ? (
                      <button className="claim-button" disabled>Récupérée</button>
                    ) : (
                      <button className="claim-button" onClick={handleDaily}>
                        Récupérer +{questsStat.orbesReward} <img src={Orbes} alt="Orbes" style={{ width: '20px', verticalAlign: 'middle' }} />
                      </button>
                    )}
                  </section>
                )}
                {user?.role === 'admin' ? (
                  <div className="rewards-admin">
                    <h4>Gestion des quêtes</h4>
                    {questsDef.length === 0 ? (
                      <p>Aucune quête définie</p>
                    ) : (
                      questsDef.map((q) => (
                        <div key={q._id} className="quest-item">
                          <span>
                            {q.name} (objectif: {q.target}, récompense: {q.reward}, reset: {q.resetFrequency})
                          </span>
                          <button
                            className="admin-btn"
                            onClick={() => handleUpdateQuest(q)}
                          >
                            Modifier
                          </button>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={q.active}
                              onChange={() => toggleQuestActive(q._id, q.active)}
                            />
                            <span className="slider round" />
                          </label>
                          <button
                            className="admin-btn"
                            onClick={() => handleDeleteQuest(q._id)}
                          >
                            Supprimer
                          </button>
                        </div>
                      ))
                    )}
                    <button className="admin-btn-add" onClick={handleCreateQuest}>Créer une nouvelle quête</button>
                  </div>
                ) : (
                  <section className="quests-user">
                    <h4>Suivi des quêtes</h4>
                    {questsStat.quests.length === 0 ? (
                      <p>Aucune quête en cours</p>
                    ) : (
                      questsStat.quests.map((q, idx) => (
                        <div key={q._id || idx} className="quest-item">
                          <span>{q.name} : {q.current}/{q.target}</span>
                          <span className={`status ${q.completed ? 'done' : 'in-progress'}`}>
                            {q.completed ? 'Terminé' : 'En cours'}
                          </span>
                          <button
                            className="claim-btn"
                            disabled={!q.completed || q.claimed}
                            onClick={() => handleClaimQuest(q._id)}
                          >
                            {!q.claimed ? (
                              <>
                                Récupérer {q.reward}{' '}
                                <img src={Orbes} alt="Orbes" style={{ width: 16, verticalAlign: 'middle' }} />
                              </>
                            ) : 'Récompensé'}
                          </button>
                        </div>
                      ))
                    )}
                  </section>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage; 