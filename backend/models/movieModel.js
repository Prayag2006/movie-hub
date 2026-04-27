const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    rating: { type: Number },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);