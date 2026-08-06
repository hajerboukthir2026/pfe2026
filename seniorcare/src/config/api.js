import axios from 'axios';

/** Adresse du backend — à modifier ici si le port change */
export const API_BASE = 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getApiErrorMessage(err, fallback = 'Une erreur est survenue.') {
  const data = err.response?.data;
  if (!data) return fallback;
  if (data.message) return data.message;
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors.map((e) => e.msg).join(', ');
  }
  return fallback;
}

// ── Auth ──────────────────────────────────────────────
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

// ── Users ─────────────────────────────────────────────
export async function fetchUsers() {
  const { data } = await api.get('/users', { headers: authHeaders() });
  return data;
}

export async function createUser(payload) {
  const { data } = await api.post('/users', payload, { headers: authHeaders() });
  return data;
}

export async function updateUser(id, payload) {
  const { data } = await api.patch(`/users/${id}`, payload, { headers: authHeaders() });
  return data;
}

export async function deleteUser(id) {
  const { data } = await api.delete(`/users/${id}`, { headers: authHeaders() });
  return data;
}

// ── Residents ─────────────────────────────────────────
export async function fetchResidents() {
  const { data } = await api.get('/residents', { headers: authHeaders() });
  return data;
}

export async function createResident(payload) {
  const { data } = await api.post('/residents', payload, { headers: authHeaders() });
  return data;
}

export async function updateResident(id, payload) {
  const { data } = await api.put(`/residents/${id}`, payload, { headers: authHeaders() });
  return data;
}

export async function archiveResident(id) {
  const { data } = await api.patch(`/residents/${id}/archive`, {}, { headers: authHeaders() });
  return data;
}

export async function addResidentNote(id, note) {
  const { data } = await api.patch(`/residents/${id}/notes`, { note }, { headers: authHeaders() });
  return data;
}

export async function addResidentMesure(id, payload) {
  const { data } = await api.post(`/residents/${id}/mesures`, payload, { headers: authHeaders() });
  return data;
}

// ── Personnel ─────────────────────────────────────────
export async function fetchPersonnel() {
  const { data } = await api.get('/personnel', { headers: authHeaders() });
  return data;
}

export async function createPersonnel(payload) {
  const { data } = await api.post('/personnel', payload, { headers: authHeaders() });
  return data;
}

export async function updatePersonnel(id, payload) {
  const { data } = await api.put(`/personnel/${id}`, payload, { headers: authHeaders() });
  return data;
}

export async function archivePersonnel(id) {
  const { data } = await api.patch(`/personnel/${id}/archive`, {}, { headers: authHeaders() });
  return data;
}

// ── Visites ───────────────────────────────────────────
export async function fetchVisites() {
  const { data } = await api.get('/visites', { headers: authHeaders() });
  return data;
}

export async function createVisite(payload) {
  const { data } = await api.post('/visites', payload, { headers: authHeaders() });
  return data;
}

export async function updateVisiteStatut(id, statut) {
  const { data } = await api.patch(`/visites/${id}/statut`, { statut }, { headers: authHeaders() });
  return data;
}

// ── Messages ──────────────────────────────────────────
export async function fetchMessages() {
  const { data } = await api.get('/messages', { headers: authHeaders() });
  return data;
}

export async function createMessage(contenu) {
  const { data } = await api.post('/messages', { contenu }, { headers: authHeaders() });
  return data;
}

export async function markMessageRead(id) {
  const { data } = await api.patch(`/messages/${id}/read`, {}, { headers: authHeaders() });
  return data;
}

// ── Plannings ─────────────────────────────────────────
export async function fetchPlannings(type) {
  const params = type ? { type } : {};
  const { data } = await api.get('/plannings', { headers: authHeaders(), params });
  return data;
}

export async function createPlanning(payload) {
  const { data } = await api.post('/plannings', payload, { headers: authHeaders() });
  return data;
}

export async function deletePlanning(id) {
  const { data } = await api.delete(`/plannings/${id}`, { headers: authHeaders() });
  return data;
}

export default api;
