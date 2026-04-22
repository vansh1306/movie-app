import { createContext, useState, useContext, useEffect } from "react";
import { getGenreList } from "../services/api";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [genres, setGenres] = useState({});

    // Load favorites from localStorage
    useEffect(() => {
        const storedFavs = localStorage.getItem("favorites");
        if (storedFavs) setFavorites(JSON.parse(storedFavs));
    }, []);

    // Save favorites to localStorage
    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    // Fetch genre list once on mount
    useEffect(() => {
        const loadGenres = async () => {
            try {
                const genreList = await getGenreList();
                const genreMap = {};
                genreList.forEach((genre) => {
                    genreMap[genre.id] = genre.name;
                });
                setGenres(genreMap);
            } catch (error) {
                console.error("Failed to load genres:", error);
            }
        };
        loadGenres();
    }, []);

    const addToFavorites = (movie) => {
        setFavorites((prev) => [...prev, movie]);
    };

    const removeFromFavorites = (movieId) => {
        setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
    };

    const isFavorite = (movieId) => {
        return favorites.some((movie) => movie.id === movieId);
    };

    const getGenreNames = (genreIds = []) => {
        return genreIds
            .slice(0, 2)
            .map((id) => genres[id])
            .filter(Boolean);
    };

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        genres,
        getGenreNames,
    };

    return (
        <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
    );
};