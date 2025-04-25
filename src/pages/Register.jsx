import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  // Désactive le scroll vertical de la page pendant ce composant
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/login');
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de l'inscription");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Créer un compte</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-alert" role="alert">{error}</div>}
          <input
            id="username"
            name="username"
            type="text"
            required
            placeholder="Nom d&apos;utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">S&apos;inscrire</button>
        </form>
      </div>
    </div>
  );
};

export default Register; 