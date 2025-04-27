import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import PokemonDetailPage from '../pages/PokemonDetailPage';
import CreatePokemonPage from '../pages/CreatePokemonPage';
import EditPokemonPage from '../pages/EditPokemonPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProfilePage from '../pages/ProfilePage';
import PrivateRoute from '../components/PrivateRoute';

// Composant qui définit toutes les routes de l'application
function AppRoutes() {
  return (
    <Routes>
      {/* Page d'accueil */}
      <Route path="/" element={<Home />} />
      {/* Page de connexion */}
      <Route path="/login" element={<Login />} />
      {/* Page d'inscription */}
      <Route path="/register" element={<Register />} />
      {/* Page de profil (protégée, nécessite d'être connecté) */}
      <Route
        path="/profile/:username"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      {/* Détail d'un Pokémon (accessible à tous) */}
      <Route path="/pokemons/:id" element={<PokemonDetailPage />} />
      {/* Création d'un Pokémon (protégée, nécessite d'être connecté) */}
      <Route
        path="/create"
        element={
          <PrivateRoute>
            <CreatePokemonPage />
          </PrivateRoute>
        }
      />
      {/* Édition d'un Pokémon (protégée, nécessite d'être connecté) */}
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