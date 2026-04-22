import "../css/Favorites.css";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import { useState } from "react";

function Favorites() {
  const { favorites } = useMovieContext();
  const [selectedMovie, setSelectedMovie] = useState(null);

  if (favorites.length > 0) {
    return (
      <div className="favorites">
        <div className="favorites-header">
          <h1>My Favorites</h1>
          <p>Your curated collection of cinematic masterpieces.</p>
          <span className="favorites-count">{favorites.length} {favorites.length === 1 ? "movie" : "movies"}</span>
        </div>
        <div className="movies-grid favorites-grid">
          {favorites.map((movie) => (
            <MovieCard movie={movie} key={movie.id} onClick={setSelectedMovie} />
          ))}
        </div>
        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
        )}
      </div>
    );
  }

  return (
    <div className="favorites-empty">
      <div className="favorites-empty-icon">💔</div>
      <h2>No Favorites Yet</h2>
      <p>Start adding movies to your favorites and they will appear here!</p>
    </div>
  );
}

export default Favorites;