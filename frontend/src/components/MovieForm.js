import React, { useState, useEffect } from 'react';

const MovieForm = ({ onMovieAdded, editingMovie, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rating: '',
    image: null,
  });

  useEffect(() => {
    if (editingMovie) {
      setFormData({
        title: editingMovie.title,
        description: editingMovie.description,
        rating: editingMovie.rating,
        image: null,
      });
    }
  }, [editingMovie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const movieData = new FormData();
    movieData.append('title', formData.title);
    movieData.append('description', formData.description);
    movieData.append('rating', formData.rating);
    if (formData.image) {
      movieData.append('image', formData.image);
    }
    onMovieAdded(movieData, editingMovie ? editingMovie._id : null);
    setFormData({ title: '', description: '', rating: '', image: null });
  };

  return (
    <form className="movie-form" onSubmit={handleSubmit}>
      <h2>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h2>
      <input
        type="text"
        name="title"
        placeholder="Movie Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />
      <input
        type="number"
        name="rating"
        placeholder="Rating (0-10)"
        value={formData.rating}
        onChange={handleChange}
        min="0"
        max="10"
      />
      <input type="file" onChange={handleFileChange} />
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {editingMovie ? 'Update Movie' : 'Add Movie'}
        </button>
        {editingMovie && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default MovieForm;
