// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1/auth',
  headers: { 'Content-Type': 'application/json' },
});

const DEFAULT_ROUTE = {
  admin: '/dashboard',
  personnel: '/dossier',
  famille: '/demandervisite',
};

export default function AuthPage({ onLogin }) {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', password: '', role: 'Famille', telephone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ── Login ─────────────────────────────────────────────
  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/login', {
        email: form.email,
        motDePasse: form.password,
      });
      localStorage.setItem('token', data.token);

      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  // ── Register ──────────────────────────────────────────
  const handleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      await api.post('/register', {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        motDePasse: form.password,
        role: form.role,
        telephone: form.telephone || undefined,
      });
      setTab('login');
      setForm({ nom: '', prenom: '', email: '', password: '', role: 'Famille', telephone: '' });
      alert("Inscription envoyée. En attente d'activation par l'administrateur.");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0a1528 0%, #0f1f3d 60%, #162a52 100%)' }}
    >
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#c9a84c,#dfc278)' }}
            >
              <span className="font-display font-bold text-xl" style={{ color: '#0f1f3d' }}>SC</span>
            </div>
            <h1 className="font-display text-3xl text-white font-bold">SeniorCare</h1>
          </div>
          <p className="text-slate-400 text-sm">Plateforme de gestion de maison de retraite</p>
        </div>

        {/* Card */}
        <div className="sc-card p-8">

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {['login', 'register'].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'btn-gold' : 'text-slate-400 hover:text-white'
                  }`}
              >
                {t === 'login' ? 'Se connecter' : "S'inscrire"}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* ── Login form ── */}
          {tab === 'login' ? (
            <div className="space-y-4">
              <div>
                <label className="sc-label">Email</label>
                <input
                  className="sc-input"
                  placeholder="votre@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
              <div>
                <label className="sc-label">Mot de passe</label>
                <input
                  type="password"
                  className="sc-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
              <button
                className="btn-gold w-full py-2.5 mt-2"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </div>

          ) : (
            /* ── Register form ── */
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="sc-label">Nom</label>
                  <input
                    className="sc-input"
                    placeholder="Ben Ali"
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  />
                </div>
                <div>
                  <label className="sc-label">Prénom</label>
                  <input
                    className="sc-input"
                    placeholder="Omar"
                    value={form.prenom}
                    onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="sc-label">Email</label>
                <input
                  className="sc-input"
                  placeholder="votre@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="sc-label">Téléphone (optionnel)</label>
                <input
                  className="sc-input"
                  placeholder="+216 XX XXX XXX"
                  value={form.telephone}
                  onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                />
              </div>
              <div>
                <label className="sc-label">Rôle</label>
                <select
                  className="sc-input"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="Famille">Famille</option>
                  <option value="Personnel">Personnel</option>
                </select>
              </div>
              <div>
                <label className="sc-label">Mot de passe</label>
                <input
                  type="password"
                  className="sc-input"
                  placeholder="Min. 6 caractères dont 1 chiffre"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <button
                className="btn-gold w-full py-2.5"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? 'Inscription...' : "S'inscrire"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}