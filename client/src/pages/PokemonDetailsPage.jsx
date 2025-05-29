import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const PokemonDetailsPage = () => {
  const { idOrName } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    height: '',
    weight: '',
    types: [],
    abilities: [],
  });

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(
          /^\d+$/.test(idOrName)
            ? `/pokemon/${idOrName}`
            : `/pokemon/name/${idOrName.toLowerCase()}`
        );
        setPokemon(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load Pokémon details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [idOrName]);

  useEffect(() => {
    if (pokemon) {
      setFormData({
        name: pokemon.name,
        height: pokemon.height,
        weight: pokemon.weight,
        types: pokemon.types,
        abilities: pokemon.abilities,
      });
    }
  }, [pokemon]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-pink-100 to-purple-200">
        <div className="w-12 h-12 border-4 border-purple-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 font-bold text-lg bg-gradient-to-br from-pink-100 to-purple-200 min-h-screen flex items-center justify-center">
        {error}
      </div>
    );
  }

  if (!pokemon) return null;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this Pokémon?'))
      return;
    try {
      await api.delete(`/pokemon/${pokemon.id}`);
      alert('Pokémon deleted');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to delete Pokémon');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to update this Pokémon?'))
      return;
    try {
      const res = await api.put(`/pokemon/${pokemon.id}`, formData);
      setPokemon(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update Pokémon');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <button
          onClick={() => navigate('/')}
          className="bg-purple-600 text-white px-4 py-2 rounded-full shadow hover:bg-purple-700 transition mb-6"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">
          {capitalize(pokemon.name)}{' '}
          <span className="text-gray-500 font-medium">#{pokemon.id}</span>
        </h1>

        {pokemon.sprites?.front_default && (
          <div className="flex justify-center mb-8">
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-48 h-48 object-contain hover:scale-110 transition-transform"
            />
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-6">
            {['name', 'height', 'weight'].map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                  {field}
                </label>
                <input
                  type={field === 'name' ? 'text' : 'number'}
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  className="w-full border p-2 rounded shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
            ))}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Types (comma separated)
              </label>
              <input
                type="text"
                value={formData.types.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    types: e.target.value.split(',').map((t) => t.trim()),
                  })
                }
                className="w-full border p-2 rounded shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Abilities (comma separated)
              </label>
              <input
                type="text"
                value={formData.abilities.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    abilities: e.target.value.split(',').map((a) => a.trim()),
                  })
                }
                className="w-full border p-2 rounded shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg shadow">
                <p className="font-semibold text-gray-700 mb-1">Height</p>
                <p className="text-lg">{pokemon.height}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow">
                <p className="font-semibold text-gray-700 mb-1">Weight</p>
                <p className="text-lg">{pokemon.weight}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-purple-700 mb-4 border-b pb-2">
                Stats
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {pokemon.stats?.map(({ name, base_stat, _id }) => (
                  <div
                    key={_id || name}
                    className="bg-white p-3 rounded-lg shadow hover:shadow-md transition"
                  >
                    <span className="capitalize font-medium text-gray-800">
                      {capitalize(name)}
                    </span>
                    : <span className="font-semibold">{base_stat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-purple-700 mb-4 border-b pb-2">
                Abilities
              </h2>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities?.map((ability, i) => (
                  <span
                    key={i}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium shadow"
                  >
                    {capitalize(ability)}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-purple-700 mb-4 border-b pb-2">
                Types
              </h2>
              <div className="flex flex-wrap gap-2">
                {pokemon.types?.map((type, i) => (
                  <span
                    key={i}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium shadow"
                  >
                    {capitalize(type)}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between gap-4 mt-8">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg shadow hover:shadow-md transition"
              >
                Edit Pokémon
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow hover:shadow-md transition"
              >
                Delete Pokémon
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PokemonDetailsPage;
