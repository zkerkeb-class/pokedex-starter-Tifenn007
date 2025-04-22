import { useState, useEffect } from 'react';
import OrbesIcon from '../../assets/orbes.png';
import './Orbes.css';
import { getCurrentUserData } from '../../services/api';
import authService from '../../services/authService';

const OrbesCounter = () => {
  const [orbes, setOrbes] = useState(0);
  useEffect(() => {
    const fetchOrbes = async () => {
      try {
        const token = authService.getToken();
        const userData = await getCurrentUserData(token);
        setOrbes(userData.orbes);
      } catch (error) {
        console.error('Impossible de récupérer les orbes', error);
      }
    };
    fetchOrbes();
    const interval = setInterval(fetchOrbes, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="orbes-counter">
      <img src={OrbesIcon} alt="Orbes" className="orbes-icon" />
      <span className="orbes-count">{orbes}</span>
    </div>
  );
};

export default OrbesCounter;