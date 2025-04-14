import './index.css';

const Search = ({ onSearch }) => {
  const handleSearch = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="search-wrapper">
      <input
        type="text"
        className="search-input"
        placeholder="Rechercher un Pokémon..."
        onChange={handleSearch}
      />
    </div>
  );
};

export default Search; 