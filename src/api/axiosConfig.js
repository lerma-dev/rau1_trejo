import axios from 'axios';

// Instancia global de axios apuntando al backend
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export default api;