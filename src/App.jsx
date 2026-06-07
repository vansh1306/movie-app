import './css/App.css'
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import { MovieProvider } from './contexts/MovieContext';
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import { Analytics } from '@vercel/analytics/react';

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
      <Analytics />
    </MovieProvider>
  )
}

export default App;
