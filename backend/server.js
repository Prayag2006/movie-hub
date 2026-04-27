const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Data file path
const DATA_FILE = path.join(__dirname, 'data.json');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Helper functions for reading/writing data
const getMovies = () => {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
};

const saveMovies = (movies) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(movies, null, 2));
};

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Routes

// GET all movies
app.get('/api/movies', (req, res) => {
    try {
        const movies = getMovies();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving movies' });
    }
});

// GET single movie
app.get('/api/movies/:id', (req, res) => {
    try {
        const movies = getMovies();
        const movie = movies.find(m => m.id === req.params.id);
        if (movie) {
            res.json(movie);
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving movie' });
    }
});

// POST new movie
app.post('/api/movies', upload.single('poster'), (req, res) => {
    try {
        const movies = getMovies();
        const { title, director, releaseYear, rating, description } = req.body;
        
        const newMovie = {
            id: uuidv4(),
            title,
            director,
            releaseYear,
            rating,
            description,
            posterUrl: req.file ? `/uploads/${req.file.filename}` : null,
            createdAt: new Date().toISOString()
        };

        movies.push(newMovie);
        saveMovies(movies);

        res.status(201).json(newMovie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding movie' });
    }
});

// PUT update movie
app.put('/api/movies/:id', upload.single('poster'), (req, res) => {
    try {
        const movies = getMovies();
        const index = movies.findIndex(m => m.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const { title, director, releaseYear, rating, description } = req.body;
        
        // Retain old poster if no new one is uploaded
        const updatedMovie = {
            ...movies[index],
            title: title || movies[index].title,
            director: director || movies[index].director,
            releaseYear: releaseYear || movies[index].releaseYear,
            rating: rating || movies[index].rating,
            description: description || movies[index].description,
            posterUrl: req.file ? `/uploads/${req.file.filename}` : movies[index].posterUrl,
            updatedAt: new Date().toISOString()
        };

        // If a new poster was uploaded, we might want to delete the old one, but for simplicity we'll keep it or let it be orphaned.
        // Actually let's delete the old one to save space
        if (req.file && movies[index].posterUrl) {
            const oldPosterPath = path.join(__dirname, movies[index].posterUrl);
            if (fs.existsSync(oldPosterPath)) {
                fs.unlinkSync(oldPosterPath);
            }
        }

        movies[index] = updatedMovie;
        saveMovies(movies);

        res.json(updatedMovie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating movie' });
    }
});

// DELETE movie
app.delete('/api/movies/:id', (req, res) => {
    try {
        let movies = getMovies();
        const movie = movies.find(m => m.id === req.params.id);

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Delete poster file
        if (movie.posterUrl) {
            const posterPath = path.join(__dirname, movie.posterUrl);
            if (fs.existsSync(posterPath)) {
                fs.unlinkSync(posterPath);
            }
        }

        movies = movies.filter(m => m.id !== req.params.id);
        saveMovies(movies);

        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting movie' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
