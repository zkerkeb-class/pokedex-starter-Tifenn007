import './PriceFilter.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function PriceFilter({ minPrice, maxPrice, onMinChange, onMaxChange, globalMin = 0, globalMax = 0 }) {
  const currentMin = minPrice === '' ? globalMin : Number(minPrice);
  const currentMax = maxPrice === '' ? globalMax : Number(maxPrice);
  return (
    <div className="filter-container price-filter">
      <h3>Filtrer par prix</h3>
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
      <div className="price-values">
        <span>{currentMin}</span> - <span>{currentMax}</span>
      </div>
    </div>
  );
}

export default PriceFilter; 