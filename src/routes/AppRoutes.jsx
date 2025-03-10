import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import PokemonDetailPage from '../pages/PokemonDetailPage';
import CreatePokemonPage from '../pages/CreatePokemonPage';
import EditPokemonPage from '../pages/EditPokemonPage';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
        <Route path="/create" element={<CreatePokemonPage />} />
        <Route path="/edit/:id" element={<EditPokemonPage />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;