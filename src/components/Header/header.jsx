import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import PokeEmpire from "../../assets/PokeEmpire.png";
import Orbes from "../../assets/orbes.png";
import { useAuth } from "../../context/AuthContext";
import OrbesCounter from "../OrbesCounter";

// Composant Header qui gère l'affichage du haut de page
// Affiche le logo, le titre, les boutons d'authentification et le menu
const Header = ({ isHomePage }) => {
  // État pour savoir si la page est scrollée
  const [isScrolled, setIsScrolled] = useState(false);
  // Récupère l'utilisateur connecté et la fonction de déconnexion
  const { user, logout } = useAuth();
  // Pour naviguer entre les pages
  const navigate = useNavigate();
  // Vérifie si l'utilisateur est admin
  const isAdmin = user?.role === 'admin';

  // Effet pour détecter le scroll et changer l'apparence du header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    // Met à jour l'état au chargement
    handleScroll();
    // Nettoie l'écouteur lors du démontage
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Déconnexion de l'utilisateur
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    // Header animé avec framer-motion
    <motion.header
      className="header"
      animate={{
        // Hauteur et fond changent selon la page et le scroll
        height: isHomePage ? (isScrolled ? "120px" : "80vh") : "120px",
        backgroundColor: isHomePage
          ? (isScrolled ? "rgba(51, 51, 51, 0.8)" : "transparent")
          : "rgba(51, 51, 51, 0.8)",
      }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Lien vers la page d'accueil avec une icône maison */}
      <Link to="/" className="home-link" aria-label="Accueil">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </Link>
      <div className="header-content">
        {/* Logo animé selon le scroll */}
        <motion.img
          src={PokeEmpire}
          alt="PokeEmpire"
          className="PokeEmpire"
          animate={{
            width: isScrolled ? "180px" : "200px",
            top: isScrolled ? "30px" : "50px",
            transform: isScrolled ? "translate(-50%, 0)" : "translate(-50%, -50%)",
          }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        />
        
        {/* Texte d'accueil affiché seulement sur la home et en haut de page */}
        {isHomePage && !isScrolled && (
          <motion.div 
            className="header-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h1 className="welcome-title">Bienvenue sur PokeEmpire</h1>
            <p className="header-description">
              Découvrez le monde fascinant des Pokémon. Explorez notre Pokédex complet, 
              apprenez-en davantage sur chaque créature et commencez votre aventure de dresseur Pokémon.
            </p>
            {/* Bandeau d'orbes pour inciter à l'inscription */}
            <div className="orbes-container">
              <img src={Orbes} alt="gauche" className="orbes-image" />
              <h1>Inscris-toi et empoche directement 10 Orbes</h1>
              <img src={Orbes} alt="droite" className="orbes-image" />
            </div>
            {/* Bouton pour explorer les Pokémon, fait défiler la page */}
            <Link 
              to="/pokemons" 
              className="explore-button"
              onClick={(e) => {
                e.preventDefault();
                const pokemonSection = document.getElementById('pokemon-section');
                if (pokemonSection) {
                  const headerHeight = document.querySelector('.header').offsetHeight;
                  const pokemonSectionTop = pokemonSection.getBoundingClientRect().top + window.pageYOffset;
                  const scrollToPosition = pokemonSectionTop - headerHeight;
                  
                  window.scrollTo({
                    top: scrollToPosition,
                    behavior: 'smooth'
                  });
                }
              }}
            >
              Explorer les Pokémon
            </Link>
          </motion.div>
        )}
      </div>
      
      {/* Boutons d'authentification ou profil selon l'état de connexion */}
      <div className="auth-buttons">
        {user ? (
          <>
            {/* Lien vers le profil */}
            <Link
              to={`/profile/${user.username || user.user?.username}`}
              className="user-email"
            >
              {"Mon profil (" + user.username + ")"}
            </Link>
            {/* Affiche le compteur d'orbes sauf pour l'admin */}
            {!isAdmin && <OrbesCounter />}
            {/* Bouton de déconnexion */}
            <button
              className="auth-button logout-button"
              onClick={handleLogout}
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            {/* Bouton de connexion */}
            <Link to="/login">
              <button className="auth-button login-button">Connexion</button>
            </Link>
            {/* Bouton d'inscription */}
            <Link to="/register">
              <button className="auth-button register-button">Inscription</button>
            </Link>
          </>
        )}
      </div>
    </motion.header>
  );
};

// Export du composant Header
export default Header;
