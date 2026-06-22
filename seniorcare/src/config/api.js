import axios from 'axios';

/** Adresse du backend — à modifier ici si le port change */
export const API_BASE = 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

/** En-tête Authorization pour les routes protégées (token dans le navigateur) */
export function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(email, motDePasse) {
  const { data } = await api.post('/auth/login', { email, motDePasse });
  return data;
}

export async function register(payload) {
  const { data } = await api.post('/auth/register', payload);
  return data;
}

export async function fetchProfile() {
  const { data } = await api.get('/auth/profile', { headers: authHeaders() });
  return data;
}

export default api;
