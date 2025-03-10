import Header from './components/Header/header';
import './App.css';
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="app">
      <Header />
      <AppRoutes />
    </div>
  );
};

export default App;