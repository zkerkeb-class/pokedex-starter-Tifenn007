import { useAuth } from '../../context/AuthContext';
import OrbesIcon from '../../assets/orbes.png';
import './Orbes.css';

const OrbesCounter = () => {
  const { user } = useAuth();
  const orbes = user?.orbes || 0;

  return (
    <div className="orbes-counter">
      <img src={OrbesIcon} alt="Orbes" className="orbes-icon" />
      <span className="orbes-count">{orbes}</span>
    </div>
  );
};

export default OrbesCounter;