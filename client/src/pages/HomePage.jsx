import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const HomePage = () => {
  const [pokemons, setPokemons] = useState([]);
  const [skip, setSkip] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [createMode, setCreateMode] = useState(false);

  const [newPokemon, setNewPokemon] = useState({
    id: '',
    name: '',
    height: '',
    weight: '',
    types: '',
    abilities: '',
    stats: {
      hp: '',
      attack: '',
      defense: '',
      'special-attack': '',
      'special-defense': '',
      speed: '',
    },
  });
  const [spriteFile, setSpriteFile] = useState(null);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  const navigate = useNavigate();
  const LIMIT = 20;

  const fetchPokemons = async () => {
    try {
      setLoading(true);
      setFetchError('');
      const res = await api.get(`/pokemon?limit=${LIMIT}&skip=${skip}`);
      const newPokemon = res.data.pokemon;

      if (Array.isArray(newPokemon)) {
        setPokemons((prev) => {
          const existingIds = new Set(prev.map((p) => p._id));
          const filteredNew = newPokemon.filter((p) => !existingIds.has(p._id));
          return [...prev, ...filteredNew];
        });
        setSkip((prev) => prev + LIMIT);
      } else {
        setFetchError('Unexpected Data Format From Server.');
      }
    } catch (err) {
      console.error(err);
      setFetchError('Failed To Load Pokémon.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError('');
    setSearchResult(null);

    const term = searchTerm.trim().toLowerCase();
    if (!term) return;

    try {
      let res;
      if (/^\d+$/.test(term)) {
        res = await api.get(`/pokemon/${term}`);
      } else {
        res = await api.get(`/pokemon/name/${term}`);
      }
      setSearchResult(res.data);
    } catch (err) {
      console.log(err);
      setSearchError('No Pokémon Found With That Name Or ID.');
    }
  };

  const handleCreatePokemon = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreateSuccess('');
    setLoading(true); // Add loading state

    const formData = new FormData();
    formData.append('id', newPokemon.id);
    formData.append('name', newPokemon.name);
    formData.append('height', newPokemon.height);
    formData.append('weight', newPokemon.weight);

    try {
      formData.append(
        'types',
        JSON.stringify(newPokemon.types.split(',').map((t) => t.trim()))
      );
      formData.append(
        'abilities',
        JSON.stringify(newPokemon.abilities.split(',').map((a) => a.trim()))
      );

      const formattedStats = Object.entries(newPokemon.stats).map(
        ([name, value]) => ({
          name,
          base_stat: parseInt(value),
        })
      );
      formData.append('stats', JSON.stringify(formattedStats));
      formData.append('sprite', spriteFile);

      const res = await api.post('/upload', formData);
      setCreateSuccess('Pokémon created successfully!');
      setPokemons((prev) => [res.data, ...prev]);
      handleCancelCreate();
    } catch (err) {
      console.log(err);
      setCreateError(
        err.response?.data?.message || 'Failed to create Pokémon.'
      );
    } finally {
      setLoading(false);
      alert('Pokémon created successfully!');
    }
  };

  const handleCancelCreate = () => {
    setCreateMode(false);
    setCreateError('');
    setCreateSuccess('');
    setNewPokemon({
      id: '',
      name: '',
      height: '',
      weight: '',
      types: '',
      abilities: '',
      stats: {
        hp: '',
        attack: '',
        defense: '',
        'special-attack': '',
        'special-defense': '',
        speed: '',
      },
    });
    setSpriteFile(null);
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">
        Pokémon Dashboard
      </h1>

      {/* Create Button */}
      {!createMode && (
        <div className="mb-4 text-center">
          <button
            onClick={() => setCreateMode(true)}
            className="bg-purple-600 text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 transition"
          >
            Create Pokémon
          </button>
        </div>
      )}

      {/* Create Pokémon Form */}
      {createMode && (
        <div className="mb-8 p-6 border rounded-lg shadow-lg bg-white max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-purple-800 mb-4">
            Create Custom Pokémon
          </h2>
          <form
            onSubmit={handleCreatePokemon}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {['id', 'name', 'height', 'weight', 'types', 'abilities'].map(
              (field) => (
                <input
                  key={field}
                  type={
                    field === 'id' || field === 'height' || field === 'weight'
                      ? 'number'
                      : 'text'
                  }
                  placeholder={capitalize(field)}
                  value={newPokemon[field]}
                  onChange={(e) =>
                    setNewPokemon({ ...newPokemon, [field]: e.target.value })
                  }
                  className="border p-2 rounded shadow-sm"
                  required
                />
              )
            )}
            {/* Stats */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              {Object.keys(newPokemon.stats).map((statKey) => (
                <input
                  key={statKey}
                  type="number"
                  placeholder={`${capitalize(statKey)} value`}
                  value={newPokemon.stats[statKey]}
                  onChange={(e) =>
                    setNewPokemon((prev) => ({
                      ...prev,
                      stats: { ...prev.stats, [statKey]: e.target.value },
                    }))
                  }
                  className="border p-2 rounded shadow-sm"
                  required
                />
              ))}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSpriteFile(e.target.files[0])}
              className="border p-2 rounded shadow-sm"
              required
            />
            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelCreate}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Save Pokémon'
                )}
              </button>
            </div>
          </form>
          {createError && <p className="text-red-500 mt-2">{createError}</p>}
          {createSuccess && (
            <p className="text-green-600 mt-2">{createSuccess}</p>
          )}
        </div>
      )}

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="mb-6 flex flex-col sm:flex-row items-center gap-4 justify-center"
      >
        <input
          type="text"
          placeholder="Search By Name Or ID (1–151)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded shadow-sm w-full sm:max-w-md"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {searchError && (
        <p className="text-red-500 mb-4 text-center">{searchError}</p>
      )}

      {searchResult && (
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold mb-2">Search Result:</h2>
          <div
            className="inline-block bg-white p-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition cursor-pointer"
            onClick={() =>
              navigate(`/pokemon/${searchResult.id || searchResult.name}`)
            }
          >
            <img
              src={searchResult.sprites.front_default}
              alt={searchResult.name}
              className="w-24 h-24 mx-auto"
            />
            <h3 className="capitalize font-semibold">
              {capitalize(searchResult.name)}
            </h3>
            <p>ID: {searchResult.id}</p>
            <p>
              Types: {searchResult.types.map((t) => capitalize(t)).join(', ')}
            </p>
          </div>
        </div>
      )}

      {fetchError && (
        <p className="text-red-500 mb-4 text-center">{fetchError}</p>
      )}

      {/* Pokémon Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {pokemons.map((poke) => (
          <div
            key={poke._id}
            onClick={() => navigate(`/pokemon/${poke.id || poke.name}`)}
            className="bg-white rounded-lg p-4 shadow hover:shadow-xl transform hover:scale-105 transition cursor-pointer text-center"
          >
            <img
              src={poke.sprites.front_default}
              alt={poke.name}
              className="w-20 h-20 mx-auto"
            />
            <h3 className="capitalize mt-2 font-semibold text-purple-700">
              {capitalize(poke.name)}
            </h3>
            <p className="text-gray-500 text-sm">ID: {poke.id || poke._id}</p>
          </div>
        ))}
      </div>

      {/* Load More */}
      {!createMode && (
        <div className="flex justify-center mt-8">
          <button
            onClick={fetchPokemons}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-full shadow hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
