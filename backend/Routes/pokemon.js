const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Pokemon = require('../Model/Pokemon');
require('dotenv').config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer + Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'custom-pokemon',
    allowed_formats: ['jpg', 'png'],
  },
});

const upload = multer({ storage });

// Create custom Pokémon
router.post('/', upload.single('sprite'), async (req, res) => {
  try {
    const { id, name, height, weight, types, abilities, stats } = req.body;
    const spriteUrl = req.file?.path;

    if (
      !id ||
      !name ||
      !height ||
      !weight ||
      !types ||
      !abilities ||
      !stats ||
      !spriteUrl
    ) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const existing = await Pokemon.findOne({ id });
    if (existing) {
      return res
        .status(409)
        .json({ error: 'Pokémon with this ID already exists.' });
    }

    const newPokemon = new Pokemon({
      id,
      name,
      height,
      weight,
      types: JSON.parse(types),
      abilities: JSON.parse(abilities),
      stats: JSON.parse(stats),
      sprites: {
        front_default: spriteUrl,
      },
    });

    await newPokemon.save();
    res.status(201).json(newPokemon);
  } catch (error) {
    console.error('Error creating Pokémon:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
