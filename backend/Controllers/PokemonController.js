const Pokemon = require('../Model/Pokemon');

// get paginated pokemon data
const getPokemon = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;

    const pokemon = await Pokemon.find()
      .sort({ id: 1 })
      .skip(skip)
      .limit(limit)
      .select('id name sprites.front_default types');

    const total = await Pokemon.countDocuments();
    res.status(200).json({
      total,
      count: pokemon.length,
      pokemon,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// get single pokemon detail
const getPokemonById = async (req, res) => {
  try {
    const pokemon = await Pokemon.findOne({ id: req.params.id });

    if (!pokemon) {
      return res.status(404).json({ message: 'Pokemon not found' });
    }

    res.status(200).json(pokemon);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// get pokemon by name
const getPokemonByName = async (req, res) => {
  try {
    const pokemon = await Pokemon.findOne({ name: req.params.name });

    if (!pokemon) {
      return res.status(404).json({ message: 'Pokemon not found' });
    }

    res.status(200).json(pokemon);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// update pokemon
const updatePokemon = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedPokemon = await Pokemon.findOneAndUpdate({ id }, updateData, {
      new: true,
    });

    if (!updatedPokemon) {
      return res.status(404).json({ message: 'Pokemon not found' });
    }

    res.status(200).json(updatedPokemon);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// delete pokemon
const deletePokemon = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPokemon = await Pokemon.findOneAndDelete({ id });

    if (!deletedPokemon) {
      return res.status(404).json({ message: 'Pokemon not found' });
    }

    res.status(200).json({ message: 'Pokemon deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPokemon,
  getPokemonById,
  getPokemonByName,
  updatePokemon,
  deletePokemon,
};
