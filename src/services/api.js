const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

const fetchFromTMDB = async (endpoint) => {
  if (!ACCESS_TOKEN || ACCESS_TOKEN === "your_read_access_token_here") {
    throw new Error(
      "TMDB access token is missing. Please add VITE_TMDB_ACCESS_TOKEN to your .env file."
    );
  }
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};

export const getPopularMovies = async () => {
  const data = await fetchFromTMDB("/movie/popular");
  return data.results;
};

export const searchMovies = async (query) => {
  const data = await fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}`);
  return data.results;
};

export const getTrendingMovies = async () => {
  const data = await fetchFromTMDB("/trending/movie/week");
  return data.results;
};

export const getTopRatedMovies = async () => {
  const data = await fetchFromTMDB("/movie/top_rated");
  return data.results;
};

export const getGenreList = async () => {
  const data = await fetchFromTMDB("/genre/movie/list");
  return data.genres;
};