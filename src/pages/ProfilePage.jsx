import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import OrbesCounter from '../components/OrbesCounter';
import './ProfilePage.css';
import { useParams } from 'react-router-dom';
import { getCurrentUserData, sellPokemon, getQuestsStatus, claimDailyReward } from '../services/api/userApi';
import { getAllQuests, createQuest, updateQuest, deleteQuest, deactivateQuest, activateQuest, claimQuestReward } from '../services/api/questApi';
import authService from '../services/authService';
import Orbes from '../assets/orbes.png';
import PokemonCard from '../components/PokemonCard';

function ProfilePage() {
  const { username } = useParams();
  const { user, updateUser, loading } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [arsenal, setArsenal] = useState([]); // Liste des Pokémon possédés
  const [loadingArsenal, setLoadingArsenal] = useState(false);
  const [errorArsenal, setErrorArsenal] = useState(null);
  const [questsDef, setQuestsDef] = useState([]); // Définitions des quêtes (admin)
  const [questsStat, setQuestsStat] = useState({ dailyRewardClaimed: false, orbesReward: 10, quests: [] }); // Statut des quêtes utilisateur
  const [loadingRewards, setLoadingRewards] = useState(false);
  const [errorRewards, setErrorRewards] = useState(null);
  // Onglet actif : arsenal (Pokémon), profil, ou rewards (quêtes)
  const [activeTab, setActiveTab] = useState(isAdmin ? 'rewards' : 'arsenal');

  // Charge l'arsenal de Pokémon de l'utilisateur (sauf admin)
  useEffect(() => {
    if (!isAdmin && activeTab === 'arsenal') {
      setLoadingArsenal(true);
      getCurrentUserData(authService.getToken())
        .then(data => setArsenal(data.pokemons))
        .catch(err => setErrorArsenal(err.message))
        .finally(() => setLoadingArsenal(false));
    }
  }, [activeTab]);

  // Charge les quêtes et leur statut (pour l'onglet rewards)
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

  // Vente d'un Pokémon (utilisateur)
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

  // Récupération de la récompense journalière
  const handleDaily = async () => {
    const token = authService.getToken();
    try {
      const data = await claimDailyReward(token);
      updateUser({ ...user, orbes: data.orbes, lastDailyReward: data.lastDailyReward });
      setQuestsStat(prev => ({ ...prev, dailyRewardClaimed: data.dailyRewardClaimed }));
    } catch (err) {
      console.error('Erreur lors de la réclamation journalière :', err);
    }
  };

  // Création d'une nouvelle quête (admin)
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

  // Mise à jour d'une quête (admin)
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

  // Suppression d'une quête (admin)
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

  // Activation/désactivation d'une quête (admin)
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

  // Récupération de la récompense d'une quête (utilisateur)
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
      {/* Affiche le compteur d'orbes sauf pour l'admin */}
      {!isAdmin && (
        <div className="profile-orbes-counter">
          <OrbesCounter />
        </div>
      )}
      {/* Onglets de navigation */}
      <div className="tabs">
        {/* Onglet Arsenal (Pokémon possédés) */}
        {!isAdmin && (
          <button
            className={activeTab === 'arsenal' ? 'active' : ''}
            onClick={() => setActiveTab('arsenal')}
          >
            Mon Arsenal
          </button>
        )}
        {/* Onglet Profil (infos utilisateur) */}
        <button
          className={activeTab === 'profil' ? 'active' : ''}
          onClick={() => setActiveTab('profil')}
        >
          Mon Profil
        </button>
        {/* Onglet Récompenses (quêtes et daily) */}
        <button
          className={activeTab === 'rewards' ? 'active' : ''}
          onClick={() => setActiveTab('rewards')}
        >
          Récompenses
        </button>
      </div>
      <div className="tab-content">
        {/* Contenu de l'onglet Arsenal */}
        {activeTab === 'arsenal' && !isAdmin && (
          <div>
            <h3>Mon Arsenal de Pokémons</h3>
            {loadingArsenal ? (
              <p>Chargement de votre arsenal...</p>
            ) : errorArsenal ? (
              <p className="error">{errorArsenal}</p>
            ) : arsenal.length > 0 ? (
              <div className="pokemon-grid">
                {arsenal.map((pokemon) => (
                  <PokemonCard
                    key={pokemon._id}
                    pokemon={pokemon}
                    isOwned={true}
                    isAdmin={false}
                    user={user}
                    handleBuy={null}
                    handleSell={() => handleSell(pokemon)}
                    isProfilePage={true}
                  />
                ))}
              </div>
            ) : (
              <p>Vous n&apos;avez pas de Pokémon dans votre arsenal. Allez les acheter !</p>
            )}
          </div>
        )}
        {/* Contenu de l'onglet Profil */}
        {activeTab === 'profil' && (
          <div>
            <h3>Informations du profil</h3>
            <p>Email: {user.email}</p>
            <p>Nom d&apos;utilisateur: {user.username || user.user?.username}</p>
            <p>Dernière connexion : {user.derConnect ? new Date(user.derConnect).toLocaleString() : 'Jamais'}</p>
          </div>
        )}
        {/* Contenu de l'onglet Récompenses (quêtes et daily) */}
        {activeTab === 'rewards' && (
          <div className="rewards-section">
            <h3>Récompenses</h3>
            {loadingRewards ? (
              <p>Chargement des récompenses...</p>
            ) : errorRewards ? (
              <p className="error">{errorRewards}</p>
            ) : (
              <>
                {/* Récompense journalière pour l'utilisateur */}
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
                {/* Gestion des quêtes pour l'admin */}
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
                          {/* Switch d'activation/désactivation de la quête */}
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
                      questsStat.quests.map((q, idx) => {
                        // Calcul du pourcentage d'avancement de la quête
                        const percent = Math.min(100, Math.round((q.current / q.target) * 100));
                        return (
                          <div key={q._id || idx} className="quest-item">
                            <div className="quest-header">
                              <span className="quest-name">{q.name}</span>
                              <span className={`status ${q.completed ? 'done' : 'in-progress'}`}>
                                {q.completed ? 'Terminé' : 'En cours'}
                              </span>
                            </div>
                            {/* Barre de progression de la quête */}
                            <div className="quest-progress-bar">
                              <div
                                className="quest-progress-bar-fill"
                                style={{ width: `${percent}%` }}
                              />
                              <span className="quest-progress-label">
                                {q.current} / {q.target}
                              </span>
                            </div>
                            {/* Bouton pour réclamer la récompense si la quête est terminée */}
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
                        );
                      })
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