import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import "../css/Home.css";
import { searchMovies, getPopularMovies, getTrendingMovies, getTopRatedMovies } from "../services/api";

function Home() {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("q") || "";

    const [popularMovies, setPopularMovies] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [trending, setTrending] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [heroIndex, setHeroIndex] = useState(0);
    const heroIntervalRef = useRef(null);

    // Load initial data once
    useEffect(() => {
        const loadData = async () => {
            try {
                const [popularData, trendingData, topRatedData] = await Promise.all([
                    getPopularMovies(),
                    getTrendingMovies(),
                    getTopRatedMovies(),
                ]);
                setPopularMovies(popularData);
                setTrending(trendingData);
                setTopRated(topRatedData.slice(0, 8));
            } catch (err) {
                console.error(err);
                setError("Failed to load movies. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // React to search query from URL
    useEffect(() => {
        if (!searchQuery) {
            setSearchResults([]);
            return;
        }
        setSearchLoading(true);
        setError(null);
        const doSearch = async () => {
            try {
                const results = await searchMovies(searchQuery);
                setSearchResults(results);
            } catch (err) {
                console.error(err);
                setError("Failed to search movies.");
            } finally {
                setSearchLoading(false);
            }
        };
        doSearch();
    }, [searchQuery]);

    // Hero carousel auto-advance
    useEffect(() => {
        if (trending.length === 0) return;
        heroIntervalRef.current = setInterval(() => {
            setHeroIndex((prev) => (prev + 1) % Math.min(5, trending.length));
        }, 5000);
        return () => clearInterval(heroIntervalRef.current);
    }, [trending]);

    const isSearching = !!searchQuery;
    const heroMovies = trending.slice(0, 5);
    const heroMovie = heroMovies[heroIndex];

    return (
        <div className="home">
            {/* Hero Carousel — hidden during search */}
            {!isSearching && heroMovies.length > 0 && (
                <div className="hero-section">
                    {heroMovie?.backdrop_path && (
                        <img
                            key={heroIndex}
                            src={`https://image.tmdb.org/t/p/w1280${heroMovie.backdrop_path}`}
                            alt={heroMovie.title}
                            className="hero-backdrop"
                        />
                    )}
                    <div className="hero-gradient" />
                    <div className="hero-content">
                        <h1 className="hero-title">{heroMovie?.title}</h1>
                        <p className="hero-overview">
                            {heroMovie?.overview?.slice(0, 150)}{heroMovie?.overview?.length > 150 ? "…" : ""}
                        </p>
                        <button className="hero-cta" onClick={() => setSelectedMovie(heroMovie)}>
                            View Details
                        </button>
                    </div>
                    <div className="hero-dots">
                        {heroMovies.map((_, i) => (
                            <button
                                key={i}
                                className={`hero-dot ${i === heroIndex ? "active" : ""}`}
                                onClick={() => {
                                    setHeroIndex(i);
                                    clearInterval(heroIntervalRef.current);
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading-state">
                    <div className="spinner" />
                    <p>Loading movies...</p>
                </div>
            ) : isSearching ? (
                /* Search Results */
                <div className="section">
                    <div className="section-header">
                        <span className="section-accent" />
                        <h2>Search Results</h2>
                        <span className="section-count">
                            {searchLoading ? "Searching…" : `${searchResults.length} found`}
                        </span>
                    </div>
                    {searchLoading ? (
                        <div className="loading-state"><div className="spinner" /></div>
                    ) : searchResults.length > 0 ? (
                        <div className="movies-grid">
                            {searchResults.map((movie) => (
                                <MovieCard movie={movie} key={movie.id} onClick={setSelectedMovie} />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>No movies found for "<strong>{searchQuery}</strong>"</p>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* Trending Now */}
                    <div className="section">
                        <div className="section-header">
                            <span className="section-accent" />
                            <h2>Trending Now</h2>
                        </div>
                        <div className="movies-grid">
                            {trending.slice(0, 8).map((movie) => (
                                <MovieCard movie={movie} key={movie.id} onClick={setSelectedMovie} />
                            ))}
                        </div>
                    </div>

                    {/* Top Rated */}
                    <div className="section">
                        <div className="section-header">
                            <span className="section-accent" />
                            <h2>Top Rated</h2>
                        </div>
                        <div className="movies-grid">
                            {topRated.map((movie) => (
                                <MovieCard movie={movie} key={movie.id} onClick={setSelectedMovie} />
                            ))}
                        </div>
                    </div>

                    {/* Popular */}
                    <div className="section">
                        <div className="section-header">
                            <span className="section-accent" />
                            <h2>Popular Movies</h2>
                        </div>
                        <div className="movies-grid">
                            {popularMovies.map((movie) => (
                                <MovieCard movie={movie} key={movie.id} onClick={setSelectedMovie} />
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Modal */}
            {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
            )}
        </div>
    );
}

export default Home;