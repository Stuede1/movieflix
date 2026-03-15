import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_KEY = "bd939714";
const BASE_URL = "https://www.omdbapi.com/?apikey=bd939714";

function Checkout() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  // Generate random price based on movie year and rating
  const generatePrice = (year, rating) => {
    const basePrice = 9.99;
    const yearMultiplier = year >= 2020 ? 1.5 : year >= 2010 ? 1.2 : 1.0;
    const ratingMultiplier = rating >= 8 ? 1.3 : rating >= 7 ? 1.1 : 1.0;
    return (basePrice * yearMultiplier * ratingMultiplier).toFixed(2);
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [movieId]);

  const fetchMovieDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}&i=${movieId}`);
      const data = response.data;

      if (data.Response === "True") {
        const price = generatePrice(parseInt(data.Year), parseFloat(data.imdbRating || 0));
        setMovie({ ...data, price });
      } else {
        setError(data.Error || "Movie not found");
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setError("Failed to fetch movie details");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };

  const handleCheckout = () => {
    alert(`Order placed for ${quantity} copy/copies of "${movie.Title}" for $${(movie.price * quantity).toFixed(2)}!`);
    navigate('/');
  };

  const handleBackToResults = () => {
    navigate(-1);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 1;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star"></i>);
    }
    if (hasHalfStar && fullStars < 5) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="checkout-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="checkout-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={handleBackToResults} className="back-button">
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = (movie.price * quantity).toFixed(2);

  return (
    <div className="checkout-container">
      <header className="checkout-header">
        <button onClick={handleBackToResults} className="back-button">
          ← Back to Results
        </button>
        <h1 className="checkout-title">Movie Checkout</h1>
      </header>

      <div className="checkout-content">
        <div className="checkout-main">
          <div className="movie-details">
            <div className="movie-poster-section">
              <img
                src={movie.Poster !== "N/A" ? movie.Poster : `https://tse1.mm.bing.net/th/id/OIP.tqmQgcjoBxS1v1ZpujoLgAHaHV?rs=1&pid=ImgDetMain&o=7&rm=3${encodeURIComponent(movie.Title)}`}
                alt={movie.Title}
                className="checkout-movie-poster"
                onError={(e) => {
                  e.target.src = `https://tse1.mm.bing.net/th/id/OIP.tqmQgcjoBxS1v1ZpujoLgAHaHV?rs=1&pid=ImgDetMain&o=7&rm=3`;
                }}
              />
            </div>

            <div className="movie-info-section">
              <h2 className="movie-title">{movie.Title}</h2>
              
              <div className="movie-meta">
                <span className="movie-year">{movie.Year}</span>
                <span className="movie-rated">{movie.Rated}</span>
                <span className="movie-runtime">{movie.Runtime}</span>
              </div>

              <div className="movie-genre">{movie.Genre}</div>

              <div className="movie-ratings">
                <div className="rating-item">
                  <div className="stars">
                    {renderStars(parseFloat(movie.imdbRating || 0))}
                  </div>
                  <span className="rating-text">{movie.imdbRating}/10</span>
                </div>
                <div className="rating-item">
                  <span className="rating-source">IMDb</span>
                  <span className="rating-votes">{movie.imdbVotes} votes</span>
                </div>
              </div>

              <div className="movie-plot">
                <h3>Plot</h3>
                <p>{movie.Plot}</p>
              </div>

              <div className="movie-cast">
                <div className="cast-item">
                  <strong>Director:</strong> {movie.Director}
                </div>
                <div className="cast-item">
                  <strong>Actors:</strong> {movie.Actors}
                </div>
                <div className="cast-item">
                  <strong>Writer:</strong> {movie.Writer}
                </div>
              </div>

              <div className="movie-additional">
                <div className="additional-item">
                  <strong>Released:</strong> {movie.Released}
                </div>
                <div className="additional-item">
                  <strong>Language:</strong> {movie.Language}
                </div>
                <div className="additional-item">
                  <strong>Country:</strong> {movie.Country}
                </div>
                {movie.Awards && movie.Awards !== "N/A" && (
                  <div className="additional-item">
                    <strong>Awards:</strong> {movie.Awards}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="checkout-sidebar">
          <div className="purchase-card">
            <h3 className="purchase-title">Purchase Details</h3>
            
            <div className="price-section">
              <div className="price-item">
                <span className="price-label">Price per movie:</span>
                <span className="price-value">${movie.price}</span>
              </div>
              
              <div className="quantity-section">
                <label htmlFor="quantity" className="quantity-label">Quantity:</label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="quantity-input"
                />
              </div>
              
              <div className="price-item total">
                <span className="price-label">Total:</span>
                <span className="price-value">${totalPrice}</span>
              </div>
            </div>

            <div className="purchase-info">
              <div className="info-item">
                <i className="fas fa-bolt"></i>
                <span>Instant digital delivery</span>
              </div>
              <div className="info-item">
                <i className="fas fa-lock"></i>
                <span>Secure payment</span>
              </div>
              <div className="info-item">
                <i className="fas fa-undo"></i>
                <span>30-day money back guarantee</span>
              </div>
            </div>

            <button onClick={handleCheckout} className="checkout-button">
              Proceed to Checkout
            </button>

            <div className="security-note">
              <i className="fas fa-shield-alt"></i>
              <span>Your payment information is secure and encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;