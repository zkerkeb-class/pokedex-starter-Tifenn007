import './AvailabilityFilter.css';

function AvailabilityFilter({ value, onChange }) {
  const options = [
    { key: 'all', label: 'Tous' },
    { key: 'available', label: 'Disponibles' },
    { key: 'unavailable', label: 'Indisponibles' },
    { key: 'owned', label: 'Possédés' }
  ];

  return (
    <div className="filter-container availability-filter">
      <h3>Disponibilité</h3>
      <div className="availability-options">
        {options.map(opt => (
          <button
            key={opt.key}
            className={`availability-button ${value === opt.key ? 'active' : ''}`}
            onClick={() => onChange(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default AvailabilityFilter; 