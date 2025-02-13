import { useState, useEffect } from 'react';

const SearchFiltered = ({ pokemons, setFilteredPokemons }) => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    setFilteredPokemons(
      pokemons.filter((pokemon) =>
        pokemon.name.french.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, pokemons, setFilteredPokemons]);

  return (
    <input
      type="text"
      placeholder="Search..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="search-bar"
    />
  );
};

export default SearchFiltered;