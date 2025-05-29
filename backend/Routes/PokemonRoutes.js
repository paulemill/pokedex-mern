const express = require('express');
const {
  getPokemon,
  getPokemonById,
  getPokemonByName,

  updatePokemon,
  deletePokemon,
} = require('../Controllers/PokemonController');
const router = express.Router();

router.get('/pokemon', getPokemon);
router.get('/pokemon/:id', getPokemonById);
router.get('/pokemon/name/:name', getPokemonByName);

router.put('/pokemon/:id', updatePokemon);
router.delete('/pokemon/:id', deletePokemon);

module.exports = router;
