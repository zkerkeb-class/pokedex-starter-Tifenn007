import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

// Page de connexion utilisateur
const Login = () => {
  // États pour stocker l'email, le mot de passe et l'éventuelle erreur
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Pour rediriger après connexion
  const { login } = useAuth(); // Fonction de connexion du contexte

  // Désactive le scroll vertical de la page pendant ce composant (pour un effet modal plein écran)
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    // Nettoyage : réactive le scroll quand on quitte la page
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  // Gestion de la soumission du formulaire de connexion
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    try {
      await login(email, password); // Tente de se connecter avec les infos saisies
      navigate('/'); // Redirige vers la page d'accueil si succès
    } catch (err) {
      // Affiche un message d'erreur si la connexion échoue
      setError(err.message || 'Une erreur est survenue lors de la connexion');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Connexion à votre compte</h2>
        <form onSubmit={handleSubmit}>
          {/* Affiche l'erreur si besoin */}
          {error && <div className="error-alert" role="alert">{error}</div>}
          {/* Champ email (obligatoire) */}
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Met à jour l'état à chaque frappe
          />
          {/* Champ mot de passe (obligatoire) */}
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Met à jour l'état à chaque frappe
          />
          {/* Bouton de soumission */}
          <button type="submit">Se connecter</button>
        </form>
        {/* Lien vers la page d'inscription */}
        <p className="auth-link">
          Pas encore de compte créé ? <Link to="/register">Inscription</Link>
        </p>
      </div>
    </div>
  );
};

export default Login; 