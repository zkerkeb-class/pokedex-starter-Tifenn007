import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import PokeEmpire from "../../assets/PokeEmpire.png";
import Orbes from "../../assets/orbes.png";
import { useAuth } from "../../context/AuthContext";
import OrbesCounter from "../OrbesCounter";

const Header = ({ isHomePage }) => {
  // État pour suivre le scroll et animer le logo
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    // état initial
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.header
      className="header"
      animate={{
        // header animé seulement sur la home, sinon header réduit fixe
        height: isHomePage ? (isScrolled ? "120px" : "80vh") : "120px",
        backgroundColor: isHomePage
          ? (isScrolled ? "rgba(51, 51, 51, 0.8)" : "transparent")
          : "rgba(51, 51, 51, 0.8)",
      }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Lien Home : affiche une icône maison pour revenir à l'accueil */}
      <Link to="/" className="home-link" aria-label="Accueil">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </Link>
      <div className="header-content">
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
            <div className="orbes-container">
              <img src={Orbes} alt="gauche" className="orbes-image" />
              <h1>Inscris-toi et empoche directement 10 Orbes</h1>
              <img src={Orbes} alt="droite" className="orbes-image" />
            </div>
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
      
      <div className="auth-buttons">
        {user ? (
          <>
            <Link
              to={`/profile/${user.username || user.user?.username}`}
              className="user-email"
            >
              {"Mon profil (" + user.username + ")"}
            </Link>
            {!isAdmin && <OrbesCounter />}
            <button
              className="auth-button logout-button"
              onClick={handleLogout}
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="auth-button login-button">Connexion</button>
            </Link>
            <Link to="/register">
              <button className="auth-button register-button">Inscription</button>
            </Link>
          </>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
