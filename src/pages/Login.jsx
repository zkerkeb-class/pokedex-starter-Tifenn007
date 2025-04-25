import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // Désactive le scroll vertical de la page pendant ce composant
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la connexion');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Connexion à votre compte</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-alert" role="alert">{error}</div>}
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
          <button type="submit">Se connecter</button>
        </form>
        <p className="auth-link">
          Pas encore de compte créé ? <Link to="/register">Inscription</Link>
        </p>
      </div>
    </div>
  );
};

export default Login; 