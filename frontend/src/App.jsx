import { useState, useEffect } from 'react';
import { Plus, LayoutGrid, ShieldCheck, Edit2, Trash2, Film, Github, Twitter, Instagram } from 'lucide-react';
import MovieCard from './components/MovieCard';
import MovieForm from './components/MovieForm';

const API_URL = 'http://localhost:5000/api/movies';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [view, setView] = useState('home'); // 'home' or 'admin'

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setMovies(data);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMovie = async (formData, id = null) => {
    setLoading(true);
    try {
      const url = id ? `${API_URL}/${id}` : API_URL;
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        await fetchMovies();
        closeForm();
      }
    } catch (error) {
      console.error('Error saving movie:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMovies(movies.filter(m => m.id !== id));
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
    } finally {
      setLoading(false);
    }
  };

  const openFormForEdit = (movie) => {
    setEditingMovie(movie);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingMovie(null);
    setIsFormOpen(false);
  };

  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="logo" onClick={() => setView('home')}>
            <div className="logo-icon">
              <Film size={24} />
            </div>
            <h2 className="title-gradient" style={{ margin: 0 }}>Movie Hub</h2>
          </div>
          <div className="nav-links">
            <button 
              className={`nav-link ${view === 'home' ? 'active' : ''}`}
              onClick={() => setView('home')}
            >
              <LayoutGrid size={18} />
              <span>Movies</span>
            </button>
            <button 
              className={`nav-link ${view === 'admin' ? 'active' : ''}`}
              onClick={() => setView('admin')}
            >
              <ShieldCheck size={18} />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content container">
        {view === 'home' ? (
          <>
            <div className="page-header">
              <span className="badge">🔥 Trending Now</span>
              <h1 className="page-title">Popular Movies</h1>
              <p className="page-subtitle">Discover the most acclaimed and trending films of the week, curated just for you.</p>
            </div>

            {loading && movies.length === 0 ? (
              <div className="loader"></div>
            ) : movies.length === 0 ? (
              <div className="empty-state">
                <h2>No movies found</h2>
                <p>Visit the Admin Panel to add some movies.</p>
              </div>
            ) : (
              <div className="movies-grid">
                {movies.map(movie => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    hideActions={true}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="admin-page">
            <div className="admin-header">
              <h1>Admin Dashboard</h1>
              <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
                <Plus size={20} />
                Add Movie
              </button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Movie</th>
                    <th>Director</th>
                    <th>Year</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map(movie => (
                    <tr key={movie.id}>
                      <td style={{ fontWeight: 600 }}>{movie.title}</td>
                      <td>{movie.director}</td>
                      <td>{movie.releaseYear}</td>
                      <td>
                        <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{movie.rating}</span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button 
                            className="btn btn-icon btn-sm" 
                            style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary-color)' }}
                            onClick={() => openFormForEdit(movie)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className="btn btn-icon btn-sm" 
                            style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger-color)' }}
                            onClick={() => handleDeleteMovie(movie.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {isFormOpen && (
        <MovieForm 
          movie={editingMovie} 
          onClose={closeForm} 
          onSave={handleSaveMovie} 
        />
      )}

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col">
            <div className="logo" style={{ marginBottom: '1rem', cursor: 'default' }}>
              <div className="logo-icon" style={{ padding: '0.4rem' }}>
                <Film size={20} />
              </div>
              <h2 className="title-gradient" style={{ margin: 0, fontSize: '1.5rem' }}>Movie Hub</h2>
            </div>
            <p>Your ultimate destination for discovering premium movies. Curated collections, stunning design, and endless entertainment.</p>
            <div className="footer-socials">
              <a href="#" className="social-icon"><Twitter size={18} /></a>
              <a href="#" className="social-icon"><Github size={18} /></a>
              <a href="#" className="social-icon"><Instagram size={18} /></a>
            </div>
          </div>
          
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); setView('home'); }}>Home</a></li>
              <li><a href="#">Top Rated</a></li>
              <li><a href="#">New Releases</a></li>
              <li><a href="#">Coming Soon</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h3>Legal</h3>
            <ul className="footer-links">
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Cookie Settings</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Movie Hub. Built with React & Node.js.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
