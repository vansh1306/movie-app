import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext";

const FALLBACK_IMAGE = "https://via.placeholder.com/300x450/1a1a1a/666?text=No+Image";

function MovieCard({ movie, onClick }) {
    const { isFavorite, addToFavorites, removeFromFavorites, getGenreNames } = useMovieContext();
    const favorite = isFavorite(movie.id);
    const genreNames = getGenreNames(movie.genre_ids);
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
    const year = movie.release_date?.split("-")[0];
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : FALLBACK_IMAGE;

    function onFavoriteClick(e) {
        e.stopPropagation();
        if (favorite) removeFromFavorites(movie.id);
        else addToFavorites(movie);
    }

    return (
        <div className="movie-card" onClick={() => onClick && onClick(movie)}>
            {/* Poster fills entire card */}
            <div className="movie-poster">
                <img src={posterUrl} alt={movie.title} loading="lazy" />
            </div>

            {/* Favorite — top right */}
            <button
                className={`favorite-btn ${favorite ? "active" : ""}`}
                onClick={onFavoriteClick}
                title={favorite ? "Remove from favorites" : "Add to favorites"}
            >
                {favorite ? "♥" : "♡"}
            </button>

            {/* Glassmorphic info panel */}
            <div className="movie-info">
                {/* Row 1: Title + Rating */}
                <div className="movie-title-row">
                    <h3 className="movie-title">{movie.title}</h3>
                    {rating && <span className="rating-badge">⭐ {rating}</span>}
                </div>
                {/* Row 2: Genres + Year */}
                <div className="movie-meta">
                    {genreNames.length > 0 && (
                        <div className="genre-pills">
                            {genreNames.map((genre) => (
                                <span key={genre} className="genre-pill">{genre}</span>
                            ))}
                        </div>
                    )}
                    {year && <span className="movie-year">{year}</span>}
                </div>
            </div>

            {/* View Details hover pill */}
            <div className="movie-overlay">
                <span className="view-details">View Details</span>
            </div>
        </div>
    );
}

export default MovieCard;