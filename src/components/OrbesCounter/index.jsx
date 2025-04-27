import { useAuth } from '../../context/AuthContext';
import OrbesIcon from '../../assets/orbes.png';
import './Orbes.css';

// Composant qui affiche le nombre d'orbes de l'utilisateur connecté
const OrbesCounter = () => {
  const { user } = useAuth(); // Récupère l'utilisateur
  const orbes = user?.orbes || 0; // Nombre d'orbes, 0 si non défini

  return (
    <div className="orbes-counter">
      <img src={OrbesIcon} alt="Orbes" className="orbes-icon" />
      <span className="orbes-count">{orbes}</span>
    </div>
  );
};

export default OrbesCounter;