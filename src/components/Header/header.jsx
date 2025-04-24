import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import PokeEmpire from "../../assets/PokeEmpire.png";
import Orbes from "../../assets/orbes.png";
import { useAuth } from "../../context/AuthContext";
import OrbesCounter from "../OrbesCounter";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState()
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
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
        height: isScrolled ? "120px" : "80vh",
        backgroundColor: isScrolled  ? "rgba(51, 51, 51, 0.8)" : "transparent",
      }}

      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
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
        
        {!isScrolled && (
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
            <OrbesCounter />
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
