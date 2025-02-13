import { useState, useEffect } from 'react';
import './index.css';

const PokemonCard = ({ name, types, image, attack, defense, hp }) => {
  const [currentHP, setCurrentHP] = useState(hp);

  useEffect(() => {
    console.log("currentHP useEffect", currentHP);
    if (currentHP <= 0) {
      alert("Pokemon is dead");
    }
  }, [currentHP]);

  console.log("🚀 ~ PokemonCard ~ types:", types);

  return (
    <div className="pokemon-card">
      <h1 className="pokemon-name">{name}</h1>
      <img className="pokemon-image" src={image} alt={name} />
      {types && types.map((type) => (
        <p key={type} className="pokemon-type">{type}</p>
      ))}
      <div className="stat">
        <p>Attack: {attack}</p>
        <div className="stat-bar">
          <div className="stat-bar-fill" style={{ width: `${attack}%` }}></div>
        </div>
      </div>
      <div className="stat">
        <p>Defense: {defense}</p>
        <div className="stat-bar">
          <div className="stat-bar-fill" style={{ width: `${defense}%` }}></div>
        </div>
      </div>
      <div className="stat">
        <p>HP: {currentHP}</p>
        <div className="stat-bar">
          <div className="stat-bar-fill" style={{ width: `${currentHP}%` }}></div>
        </div>
      </div>
      <button className="pokemon-attack-button" onClick={() => {
        console.log("🚀 ~ bulbizard se mange une patate");
        setCurrentHP(currentHP - 10);
      }}>
        Attaque
      </button>
    </div>
  );
};

export default PokemonCard;