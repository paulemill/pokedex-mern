import './App.css';
import HomePage from './pages/HomePage';
import PokemonDetailsPage from './pages/PokemonDetailsPage';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/pokemon/:idOrName" element={<PokemonDetailsPage />} />
    </Routes>
  );
}

export default App;
