const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Movie = require('./models/movieModel');
const User = require('./models/userModel');
const movieRoutes = require('./routes/movieRoutes');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());


const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ isAdmin: true });
    if (!adminExists) {
      const username = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
      const password = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
      await User.create({ username, password, isAdmin: true });
      console.log(`Default admin created: ${username}/${password}`);
    }

    // Seed movies if empty
    const movieCount = await Movie.countDocuments();
    if (movieCount === 0) {
      const sampleMovies = [
        {
          title: "Inception",
          description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
          rating: 8.8,
          image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Interstellar",
          description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
          rating: 8.7,
          image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "The Dark Knight",
          description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
          rating: 9.0,
          image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "The Matrix",
          description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
          rating: 8.7,
          image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Pulp Fiction",
          description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
          rating: 8.9,
          image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Gladiator",
          description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
          rating: 8.5,
          image: "https://images.unsplash.com/photo-1559581484-9efa23730114?auto=format&fit=crop&w=800&q=80"
        }

      ];
      await Movie.create(sampleMovies);
      console.log("Sample movies seeded successfully!");
    }
  } catch (error) {
    console.error(`Failed to initialize data: ${error.message}`);
  }
};


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await createAdminUser();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
