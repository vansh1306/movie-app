import { useEffect } from "react";
import "../css/MovieModal.css";
import { useMovieContext } from "../contexts/MovieContext";

const FALLBACK_POSTER = "https://via.placeholder.com/200x300/1a1a1a/666?text=No+Image";

function MovieModal({ movie, onClose }) {
    const { isFavorite, addToFavorites, removeFromFavorites, getGenreNames } = useMovieContext();
    const favorite = isFavorite(movie.id);
    const genreNames = getGenreNames(movie.genre_ids);
    const year = movie.release_date?.split("-")[0];
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
        : null;
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
        : FALLBACK_POSTER;

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    function toggleFavorite() {
        if (favorite) removeFromFavorites(movie.id);
        else addToFavorites(movie);
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                {/* Backdrop */}
                <div className="modal-backdrop">
                    {backdropUrl ? (
                        <img src={backdropUrl} alt={movie.title} />
                    ) : (
                        <div className="modal-backdrop-placeholder" />
                    )}
                    <div className="modal-backdrop-gradient" />
                    <button className="modal-close-btn" onClick={onClose}>✕</button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    <div className="modal-poster">
                        <img src={posterUrl} alt={movie.title} />
                    </div>
                    <div className="modal-info">
                        <h2 className="modal-title">{movie.title}</h2>
                        <div className="modal-meta">
                            {year && <span className="modal-year">{year}</span>}
                            <span className="modal-rating">⭐ {rating}</span>
                            {movie.vote_count > 0 && (
                                <span className="modal-votes">{movie.vote_count.toLocaleString()} votes</span>
                            )}
                        </div>
                        {genreNames.length > 0 && (
                            <div className="modal-genres">
                                {genreNames.map((genre) => (
                                    <span key={genre} className="modal-genre-pill">{genre}</span>
                                ))}
                            </div>
                        )}
                        <p className="modal-overview">
                            {movie.overview || "No description available for this movie."}
                        </p>
                        <button
                            className={`modal-fav-btn ${favorite ? "active" : ""}`}
                            onClick={toggleFavorite}
                        >
                            {favorite ? "♥ Remove from Favorites" : "♡ Add to Favorites"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieModal;
