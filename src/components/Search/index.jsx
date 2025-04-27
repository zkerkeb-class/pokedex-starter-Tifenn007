import './index.css';

// Composant de barre de recherche pour filtrer les Pokémon
const Search = ({ onSearch }) => {
  // Fonction appelée à chaque changement dans le champ de recherche
  const handleSearch = (e) => {
    // On transmet la valeur saisie à la fonction de recherche du parent
    onSearch(e.target.value);
  };

  return (
    <div className="search-wrapper">
      <input
        type="text"
        className="search-input"
        placeholder="Rechercher un Pokémon..."
        onChange={handleSearch} // Appelle handleSearch à chaque frappe
      />
    </div>
  );
};

export default Search; 