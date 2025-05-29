const mongoose = require('mongoose');

const pokemonSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  types: {
    type: [String],
    required: true,
  },
  stats: [
    {
      name: { type: String, required: true },
      base_stat: { type: Number, required: true },
    },
  ],
  sprites: {
    front_default: { type: String, required: true },
    back_default: { type: String },
  },
  abilities: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model('Pokemon', pokemonSchema);
