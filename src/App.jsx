import './css/App.css'
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import { MovieProvider } from './contexts/MovieContext';
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';

function App() {
  return (
    <MovieProvider>
      <Navbar />
      <main className='main-content'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
    </MovieProvider>
  )
}

export default App;
