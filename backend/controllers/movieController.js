const Movie = require('../models/movieModel');
const path = require('path');
const fs = require('fs');

const createMovie = async (req, res) => {
  try {
    const { title, description, rating } = req.body;
    const newMovie = new Movie({
      title,
      description,
      rating,
      image: req.file ? req.file.filename : '',
    });
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMovie = async (req, res) => {
  try {
    const { title, description, rating } = req.body;
    let updateData = { title, description, rating };
    if (req.file) {
      updateData.image = req.file.filename;
    }
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie && movie.image) {
      const imagePath = path.join(__dirname, '../uploads/', movie.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMovie,
  getMovies,
  updateMovie,
  deleteMovie
};
