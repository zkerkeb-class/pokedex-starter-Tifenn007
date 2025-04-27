import './AvailabilityFilter.css';

// Composant fonctionnel React pour filtrer selon la disponibilité
// Props :
//   - value : la valeur actuellement sélectionnée du filtre
//   - onChange : fonction appelée lors d'un changement de filtre
function AvailabilityFilter({ value, onChange }) {
  // Définition des différentes options de filtre disponibles
  const options = [
    { key: 'all', label: 'Tous' }, // Affiche tous les éléments
    { key: 'available', label: 'Disponibles' }, // Affiche uniquement les éléments disponibles
    { key: 'unavailable', label: 'Indisponibles' }, // Affiche uniquement les éléments indisponibles
    { key: 'owned', label: 'Possédés' } // Affiche uniquement les éléments possédés
  ];

  // Rendu du composant :
  // - Un titre
  // - Une liste de boutons correspondant à chaque option de filtre
  //   Le bouton actif est mis en avant grâce à la classe 'active'
  return (
    <div className="filter-container availability-filter">
      <h3>Disponibilité</h3>
      <div className="availability-options">
        {options.map(opt => (
          <button
            key={opt.key} // Clé unique pour chaque bouton
            className={`availability-button ${value === opt.key ? 'active' : ''}`}
            onClick={() => onChange(opt.key)} // Appelle la fonction onChange avec la clé sélectionnée
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Exportation du composant pour pouvoir l'utiliser dans d'autres fichiers
export default AvailabilityFilter; 