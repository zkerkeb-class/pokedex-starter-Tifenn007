import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Header from './components/Header/header';
import './App.css';
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from './context/AuthContext';

const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="app">
      {isHomePage && <Header />}
      <AppRoutes />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;