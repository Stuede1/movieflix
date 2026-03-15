import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchMovieById, processMovieResults, extractYears, getFilteredMovies } from '../utils/movieUtils';

const API_KEY = "bd939714";
const BASE_URL = "https://www.omdbapi.com/?apikey=bd939714";

function Browse() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSort, setCurrentSort] = useState('default');
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const navigate = useNavigate();

  const randomSearchTerms = [
    'action', 'comedy', 'drama', 'thriller', 'romance', 'horror', 
    'sci-fi', 'adventure', 'mystery', 'fantasy', 'animation', 'crime',
    'war', 'western', 'musical', 'documentary', 'family', 'superhero',
    'marvel', 'dc', 'disney', 'pixar', 'dreamworks', 'paramount',
    'universal', 'sony', 'warner', 'netflix', 'hbo', 'amazon'
  ];

  useEffect(() => {
    fetchRandomMovies();
  }, []);

  const fetchRandomMovies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const randomTerm = randomSearchTerms[Math.floor(Math.random() * randomSearchTerms.length)];
      const url = `${BASE_URL}&s=${encodeURIComponent(randomTerm)}&page=1`;
      const response = await axios.get(url);
      const data = response.data;

      if (data.Response === "True" && data.Search) {
        const limitedResults = data.Search.slice(0, 9);
        const moviePromises = limitedResults.map((movie) =>
          fetchMovieById(movie.imdbID, BASE_URL)
        );
        const movieResults = await Promise.all(moviePromises);

        const processedResults = processMovieResults(movieResults);

        setMovies(processedResults);
        extractYears(processedResults, setAvailableYears);
      } else {
        await fetchRandomMovies();
      }
    } catch (error) {
      console.error("Error fetching random movies:", error);
      setError("Failed to fetch movies");
      setMovies([]);
      setAvailableYears([]);
    } finally {
      setLoading(false);
    }
  };


  const handleSort = (e) => {
    setCurrentSort(e.target.value);
  };

  const handleYearFilter = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleMovieClick = (movieTitle) => {
    navigate(`/results/${encodeURIComponent(movieTitle)}`);
  };

  const handleRefreshMovies = () => {
    fetchRandomMovies();
  };

  const filteredMovies = getFilteredMovies(movies, selectedYear, currentSort);

  return (
    <div className="results-container">
      <header className="results-header">
        <button onClick={handleBackToHome} className="back-button">
          ← Back to Home
        </button>
        <h1 className="results-title">
          Browse Random Movies
        </h1>
        <button onClick={handleRefreshMovies} className="refresh-button">
          🔄 Refresh Movies
        </button>
      </header>

      <section className="filters-section">
        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="sortSelect">Sort by:</label>
            <select
              id="sortSelect"
              value={currentSort}
              onChange={handleSort}
              className="sort-select"
            >
              <option value="default">Default</option>
              <option value="random">Random</option>
              <option value="alphabetical-az">Title (A-Z)</option>
              <option value="alphabetical-za">Title (Z-A)</option>
              <option value="newest-to-oldest">Year (Newest to Oldest)</option>
              <option value="oldest-to-newest">Year (Oldest to Newest)</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="yearSelect">Year:</label>
            <select
              id="yearSelect"
              value={selectedYear}
              onChange={handleYearFilter}
              className="year-select"
            >
              <option value="">All Years</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="movies-section">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Discovering movies...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={handleRefreshMovies} className="refresh-button">
              Try Again
            </button>
            <button onClick={handleBackToHome} className="home-button">
              Back to Home
            </button>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="no-results">
            <p>No movies found. Try refreshing!</p>
            <button onClick={handleRefreshMovies} className="refresh-button">
              Refresh Movies
            </button>
            <button onClick={handleBackToHome} className="home-button">
              Back to Home
            </button>
          </div>
        ) : (
          <div className="movies-grid">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="movie-card"
                onClick={() => handleMovieClick(movie.title)}
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="movie-poster"
                  onError={(e) => {
                    e.target.src = `https://tse1.mm.bing.net/th/id/OIP.tqmQgcjoBxS1v1ZpujoLgAHaHV?rs=1&pid=ImgDetMain&o=7&rm=3`;
                  }}
                />
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-year">{movie.year}</p>
                  <p className="movie-genre">{movie.genre}</p>
                </div>
                <div className="buy-now-slider">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/checkout/${movie.id}`);
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Browse;
