import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pokedex-backend-er7i.onrender.com/api',
});

export default api;
