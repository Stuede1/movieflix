import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/results/${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="home-container">
      <nav className="home-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <i className="fas fa-film"></i>
            <span>MovieFlix</span>
          </div>
          <div className="nav-links">
            <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>Home</a>
            <a href="/browse" className="nav-link">Browse</a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); alert('Feature not implemented'); }}>My Library</a>
            <button className="nav-signin" onClick={() => alert('Feature not implemented')}>Sign In</button>
          </div>
        </div>
      </nav>

      <header className="home-header">
        <h1 className="app-title">MovieFlix</h1>
        <p className="app-subtitle">Search and discover your favorite movies</p>
      </header>

      <section className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for movies..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </div>
        </form>
      </section>

      <section className="animation-section">
        <div className="movie-reel">
          <div className="reel-container">
            <div className="movie-strip">
              <div className="movie-frame">
                <div className="frame-hole"></div>
                <div className="frame-content">
                  <i className="fas fa-film"></i>
                </div>
                <div className="frame-hole"></div>
              </div>
              <div className="movie-frame">
                <div className="frame-hole"></div>
                <div className="frame-content">
                  <i className="fas fa-video"></i>
                </div>
                <div className="frame-hole"></div>
              </div>
              <div className="movie-frame">
                <div className="frame-hole"></div>
                <div className="frame-content">
                  <i className="fas fa-camera"></i>
                </div>
                <div className="frame-hole"></div>
              </div>
              <div className="movie-frame">
                <div className="frame-hole"></div>
                <div className="frame-content">
                  <i className="fas fa-popcorn"></i>
                </div>
                <div className="frame-hole"></div>
              </div>
              <div className="movie-frame">
                <div className="frame-hole"></div>
                <div className="frame-content">
                  <i className="fas fa-ticket-alt"></i>
                </div>
                <div className="frame-hole"></div>
              </div>
              <div className="movie-frame">
                <div className="frame-hole"></div>
                <div className="frame-content">
                  <i className="fas fa-clapperboard"></i>
                </div>
                <div className="frame-hole"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="floating-movies">
          <div className="floating-movie movie-1">
            <i className="fas fa-film"></i>
          </div>
          <div className="floating-movie movie-2">
            <i className="fas fa-video"></i>
          </div>
          <div className="floating-movie movie-3">
            <i className="fas fa-camera"></i>
          </div>
          <div className="floating-movie movie-4">
            <i className="fas fa-popcorn"></i>
          </div>
          <div className="floating-movie movie-5">
            <i className="fas fa-ticket-alt"></i>
          </div>
          <div className="floating-movie movie-6">
            <i className="fas fa-clapperboard"></i>
          </div>
        </div>

        <div className="search-prompt">
          <h2>Start Your Movie Journey</h2>
          <p>Search for any movie and explore our vast collection</p>
          <div className="search-examples">
            <span>Try: </span>
            <button 
              className="example-search"
              onClick={() => setSearchTerm('Avengers')}
            >
              Avengers
            </button>
            <button 
              className="example-search"
              onClick={() => setSearchTerm('Harry Potter')}
            >
              Harry Potter
            </button>
            <button 
              className="example-search"
              onClick={() => setSearchTerm('Star Wars')}
            >
              Star Wars
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;