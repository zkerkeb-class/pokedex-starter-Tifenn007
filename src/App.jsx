import {} from 'react';
import axios from 'axios';


import Header from './components/Header/header'
import './App.css'
import './services/api';



const App = () => {
  return (
    <div className="app">
      <Header />
    </div>
  );
};

export default App;