import { useState } from 'react';
import pokemons from './assets/pokemons'
import PokemonCard from './components/PokemonCard'
import SearchFiltered from './components/SearchFiltered'
import './App.css'


function App() {
  const [filteredPokemons, setFilteredPokemons] = useState(pokemons);
  return (
    <div className="app-container">
      <div className="search-container">
        <SearchFiltered pokemons={pokemons} setFilteredPokemons={setFilteredPokemons} />
      </div>
      <div className="pokemon-list">
        {filteredPokemons.length > 0 ? (
          filteredPokemons.map((pokemon, index) => (
            <PokemonCard 
              key={index}
              name={pokemon.name.french} 
              image={pokemon.image}
              types={pokemon.types}
              attack={pokemon.base.Attack} 
              defense={pokemon.base.Defense}
              hp={pokemon.base.HP}
            />
          ))
        ) : (
          <p className="no-results">no results</p>
        )}
      </div>
    </div>
  );
}

export default App;