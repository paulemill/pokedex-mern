const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const PokemonRoutes = require('./Routes/PokemonRoutes');
const UploadPokemonRoutes = require('./Routes/pokemon');

//Middlewares
const app = express();
const PORT = process.env.PORT || 4000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected..'))
  .catch((err) => console.log(err));

// CORS config
const allowedOrigins = [
  'http://localhost:5173',
  'https://pokedex-frontend-jawq.onrender.com/api', // Replace with your actual deployed frontend URL
];

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'CORS policy does not allow access from this origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.static('public'));
app.use(express.json());

// Routes
app.use('/api', PokemonRoutes);
app.use('/api/upload', UploadPokemonRoutes);

// Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
