import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import PokemonDetailPage from '../pages/PokemonDetailPage';
import CreatePokemonPage from '../pages/CreatePokemonPage';
import EditPokemonPage from '../pages/EditPokemonPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import PrivateRoute from '../components/PrivateRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pokemons/:id" element={<PokemonDetailPage />} />
      <Route
        path="/create"
        element={
          <PrivateRoute>
            <CreatePokemonPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/edit/:id"
        element={
          <PrivateRoute>
            <EditPokemonPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;