import { useState, useRef, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

const MovieForm = ({ movie, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    releaseYear: new Date().getFullYear(),
    rating: 5,
    description: ''
  });
  const [posterFile, setPosterFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || '',
        director: movie.director || '',
        releaseYear: movie.releaseYear || new Date().getFullYear(),
        rating: movie.rating || 5,
        description: movie.description || ''
      });
      if (movie.posterUrl) {
        setPreviewUrl(`http://localhost:5000${movie.posterUrl}`);
      }
    }
  }, [movie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    
    if (posterFile) {
      data.append('poster', posterFile);
    }

    onSave(data, movie?.id);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>
          <X size={24} />
        </button>
        
        <h2 style={{ marginBottom: '2rem' }}>{movie ? 'Edit Movie' : 'Add New Movie'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Movie Title</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              className="form-control" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Inception"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="director">Director</label>
              <input 
                type="text" 
                id="director" 
                name="director" 
                className="form-control" 
                value={formData.director} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="releaseYear">Release Year</label>
              <input 
                type="number" 
                id="releaseYear" 
                name="releaseYear" 
                className="form-control" 
                value={formData.releaseYear} 
                onChange={handleChange} 
                required 
                min="1900" 
                max="2100"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating (1-10)</label>
            <input 
              type="number" 
              id="rating" 
              name="rating" 
              className="form-control" 
              value={formData.rating} 
              onChange={handleChange} 
              required 
              min="1" 
              max="10"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea 
              id="description" 
              name="description" 
              className="form-control" 
              value={formData.description} 
              onChange={handleChange} 
              required 
              placeholder="Brief summary of the movie..."
            ></textarea>
          </div>

          <div className="form-group">
            <label>Movie Poster</label>
            <div className="file-input-wrapper">
              <button type="button" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Upload size={18} />
                {posterFile ? 'Change Image' : 'Upload Image'}
              </button>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                ref={fileInputRef}
              />
            </div>
            
            {previewUrl && (
              <div className="file-preview">
                <img src={previewUrl} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn" onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)' }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {movie ? 'Save Changes' : 'Add Movie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieForm;
