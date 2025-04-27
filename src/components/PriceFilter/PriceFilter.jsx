import './PriceFilter.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// Composant qui permet de filtrer les Pokémon par prix avec un slider
function PriceFilter({ minPrice, maxPrice, onMinChange, onMaxChange, globalMin = 0, globalMax = 0 }) {
  // Valeurs courantes du slider (si vide, on prend les bornes globales)
  const currentMin = minPrice === '' ? globalMin : Number(minPrice);
  const currentMax = maxPrice === '' ? globalMax : Number(maxPrice);
  return (
    <div className="filter-container price-filter">
      <h3>Filtrer par prix</h3>
      {/* Slider double pour choisir la plage de prix */}
      <Slider
        range
        min={globalMin}
        max={globalMax}
        allowCross={false}
        value={[currentMin, currentMax]}
        onChange={([newMin, newMax]) => {
          onMinChange(newMin);
          onMaxChange(newMax);
        }}
      />
      {/* Affichage des valeurs sélectionnées */}
      <div className="price-values">
        <span>{currentMin}</span> - <span>{currentMax}</span>
      </div>
    </div>
  );
}

export default PriceFilter; 