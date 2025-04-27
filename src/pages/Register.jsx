import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

// Page d'inscription utilisateur
const Register = () => {
  // États pour stocker le nom d'utilisateur, l'email, le mot de passe et l'éventuelle erreur
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Pour rediriger après inscription
  const { register } = useAuth(); // Fonction d'inscription du contexte

  // Désactive le scroll vertical de la page pendant ce composant (pour un effet modal plein écran)
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    // Nettoyage : réactive le scroll quand on quitte la page
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  // Gestion de la soumission du formulaire d'inscription
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    try {
      await register(username, email, password); // Tente de s'inscrire avec les infos saisies
      navigate('/login'); // Redirige vers la page de connexion si succès
    } catch (err) {
      // Affiche un message d'erreur si l'inscription échoue
      setError(err.message || "Une erreur est survenue lors de l'inscription");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Créer un compte</h2>
        <form onSubmit={handleSubmit}>
          {/* Affiche l'erreur si besoin */}
          {error && <div className="error-alert" role="alert">{error}</div>}
          {/* Champ nom d'utilisateur (obligatoire) */}
          <input
            id="username"
            name="username"
            type="text"
            required
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Met à jour l'état à chaque frappe
          />
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
          <button type="submit">S&apos;inscrire</button>
        </form>
        {/* Lien vers la page de connexion */}
        <p className="auth-link">
          Vous avez déjà un compte ? <Link to="/login">Connexion</Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 