import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import "./Header.css";
import PokeEmpire from "../../assets/PokeEmpire.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0); // Vérifie si on a scrollé
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className="header"
      animate={{
        height: isScrolled ? "80px" : "80vh", // Hauteur réduite lors du scroll
        backgroundColor: isScrolled ? "#333" : "transparent", // Changement de couleur de fond
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.img
        src={PokeEmpire}
        alt="PokeEmpire"
        className="PokeEmpire"
        animate={{
          width: isScrolled ? "120px" : "200px", // Taille du logo réduite
          top: isScrolled ? "20px" : "50px", // Descend légèrement le logo pour le rendre plus visible
          transform: isScrolled ? "translate(-50%, 0)" : "translate(-50%, -50%)", // Centrage du logo
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </motion.header>
  );
};

export default Header;
