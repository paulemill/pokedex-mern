import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pokedex-backend-er7i.onrender.com',
});

export default api;
