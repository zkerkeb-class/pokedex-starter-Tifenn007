// Importation de StrictMode pour détecter les problèmes potentiels dans l'application
import { StrictMode } from 'react'
// Importation de la fonction pour créer la racine React
import { createRoot } from 'react-dom/client'
// Importation des styles globaux
import './index.css'
// Importation du composant principal de l'application
import App from './App.jsx'

// Point d'entrée de l'application React
// On sélectionne l'élément HTML avec l'id 'root' pour y afficher l'application
createRoot(document.getElementById('root')).render(
  // StrictMode aide à repérer les erreurs et les mauvaises pratiques en développement
  <StrictMode>
    {/* Affiche le composant principal App */}
    <App />
  </StrictMode>,
)
