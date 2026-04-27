import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CookieConsent from './components/CookieConsent';
import MovieForm from './components/MovieForm';

import MovieCard from './components/MovieCard';
import Login from './components/Login';
import './App.css';

const API_URL = 'http://localhost:5000/api/movies';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMovie, setEditingMovie] = useState(null);
  const [adminUser, setAdminUser] = useState(JSON.parse(localStorage.getItem('adminInfo')));
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setMovies(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch movies');
      setLoading(false);
    }
  };

  const handleAddOrUpdateMovie = async (formData, id) => {
    const config = {
      headers: {
        'user-id': adminUser ? adminUser._id : '',
      },
    };
    try {
      if (id) {
        await axios.put(`${API_URL}/${id}`, formData, config);
        setEditingMovie(null);
      } else {
        await axios.post(API_URL, formData, config);
        setShowAddForm(false);
      }
      fetchMovies();
    } catch (err) {
      setError('Error saving movie');
    }
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      const config = {
        headers: {
          'user-id': adminUser ? adminUser._id : '',
        },
      };
      try {
        await axios.delete(`${API_URL}/${id}`, config);
        fetchMovies();
      } catch (err) {
        setError('Error deleting movie');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    setAdminUser(null);
  };

  const handleEditClick = (movie) => {
    setEditingMovie(movie);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Router>
      <div className="App">
        <Navbar adminUser={adminUser} onLogout={handleLogout} />
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login setAdminUser={setAdminUser} />} />
            <Route path="/" element={
              <>
                {adminUser && (
                  <>
                    {!showAddForm && !editingMovie && (
                      <button
                        className="btn-add-movie"
                        onClick={() => setShowAddForm(true)}
                      >
                        + Add New Movie
                      </button>
                    )}

                    {(showAddForm || editingMovie) && (
                      <MovieForm
                        onMovieAdded={handleAddOrUpdateMovie}
                        editingMovie={editingMovie}
                        onCancel={() => {
                          setEditingMovie(null);
                          setShowAddForm(false);
                        }}
                      />
                    )}
                  </>
                )}

                {adminUser && <hr />}

                <h2>All Movies</h2>
                {loading ? (
                  <div className="loading">Loading movies...</div>
                ) : error ? (
                  <div className="error">{error}</div>
                ) : (
                  <div className="movie-grid">
                    {movies.length > 0 ? (
                      movies.map((movie) => (
                        <MovieCard
                          key={movie._id}
                          movie={movie}
                          onEdit={(movie) => {
                            handleEditClick(movie);
                            setShowAddForm(false);
                          }}
                          onDelete={adminUser ? handleDeleteMovie : null}
                          isAdmin={!!adminUser}
                        />
                      ))
                    ) : (
                      <p>No movies found.</p>
                    )}
                  </div>
                )}
              </>
            } />
          </Routes>
        </div>
        <CookieConsent />
      </div>
    </Router>

  );
}

export default App;
