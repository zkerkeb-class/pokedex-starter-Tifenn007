import axios from "axios";

axios.get("http://localhost:3000/pokemon")
  .then(response => console.log("API connected :", response.data))
  .catch(error => console.error("Erreur lors de la récupération des Pokémon :", error));