const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');
const { createMovie, getMovies, updateMovie, deleteMovie } = require('../controllers/movieController');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/', protect, admin, upload.single('image'), createMovie);
router.get('/', getMovies);
router.put('/:id', protect, admin, upload.single('image'), updateMovie);
router.delete('/:id', protect, admin, deleteMovie);

module.exports = router;
