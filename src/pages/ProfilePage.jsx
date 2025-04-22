import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import OrbesCounter from '../components/OrbesCounter';
import './ProfilePage.css';
import { useParams } from 'react-router-dom';

function ProfilePage() {
  const { username } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('arsenal');

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
            <p>Vous pourrez bientôt voir la liste de vos Pokémons achetés ici.</p>
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