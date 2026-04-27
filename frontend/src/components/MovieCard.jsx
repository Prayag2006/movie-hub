import { Star, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';

const MovieCard = ({ movie, onEdit, onDelete, hideActions }) => {
  const posterUrl = movie.posterUrl 
    ? `http://localhost:5000${movie.posterUrl}` 
    : null;

  return (
    <div className="movie-card">
      <div className="movie-poster-container">
        {posterUrl ? (
          <img src={posterUrl} alt={movie.title} className="movie-poster" />
        ) : (
          <div className="movie-poster" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', flexDirection: 'column', color: 'var(--text-muted)' }}>
            <ImageIcon size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <span>No Poster</span>
          </div>
        )}
        
        {!hideActions && (
          <div className="movie-overlay">
            <button className="btn-icon" onClick={onEdit} title="Edit">
              <Edit2 size={18} />
            </button>
            <button className="btn-icon" onClick={onDelete} title="Delete" style={{ color: '#ef4444' }}>
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
      
      <div className="movie-info">
        <h3 className="movie-title" title={movie.title}>{movie.title}</h3>
        
        <div className="movie-meta">
          <span>{movie.releaseYear} • {movie.director}</span>
          <div className="rating">
            <Star size={16} fill="currentColor" />
            <span>{movie.rating}/10</span>
          </div>
        </div>
        
        <p className="movie-description">{movie.description}</p>
      </div>
    </div>
  );
};

export default MovieCard;
