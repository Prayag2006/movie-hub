import React from 'react';

const MovieCard = ({ movie, onEdit, onDelete, isAdmin }) => {
  // Check if image is a full URL or just a filename
  const imageUrl = movie.image && (movie.image.startsWith('http') || movie.image.startsWith('https'))
    ? movie.image 
    : movie.image 
      ? `http://localhost:5000/uploads/${movie.image}` 
      : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="movie-card">
      <div className="movie-image-container">
        <img src={imageUrl} alt={movie.title} className="movie-image" />
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <div className="rating">
          <span>{movie.rating}</span>/10
        </div>
        <p className="description">{movie.description}</p>
        {isAdmin && (
          <div className="actions">
            <button className="btn-edit" onClick={() => onEdit(movie)}>Edit</button>
            <button className="btn-delete" onClick={() => onDelete(movie._id)}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;

