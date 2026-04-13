// src/pages/admin/Dashboard.jsx
import React from 'react';
import { SectionHeader, Badge } from '../../components/UI';

export default function Dashboard({ residents, personnel, visites, messages }) {
  const stats = [
    { label: 'Résidents actifs',   val: residents.filter((r) => r.statut === 'actif').length },
    { label: 'Personnel',          val: personnel.length },
    { label: 'Visites en attente', val: visites.filter((v) => v.statut === 'en attente').length },
    { label: 'Messages non lus',   val: messages.filter((m) => !m.lu).length },
  ];

  return (
    <div>
      <SectionHeader title="Tableau de bord" subtitle="Vue d'ensemble de SeniorCare" />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <p className="text-3xl font-display font-bold" style={{ color: '#c9a84c' }}>{s.val}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Messages */}
        <div className="sc-card p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#c9a84c' }}>Derniers messages famille</h3>
          {messages.length === 0 ? (
            <p className="text-slate-500 text-sm">Aucun message</p>
          ) : (
            messages.slice(0, 4).map((m) => (
              <div key={m.id} className="table-row py-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm text-white">{m.de}</p>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{m.contenu}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{m.date}</p>
                  </div>
                  {!m.lu && <Badge label="Nouveau" type="green" />}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Visites */}
        <div className="sc-card p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#c9a84c' }}>Visites récentes</h3>
          {visites.length === 0 ? (
            <p className="text-slate-500 text-sm">Aucune visite</p>
          ) : (
            visites.slice(0, 4).map((v) => (
              <div key={v.id} className="table-row py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">{v.resident}</p>
                  <p className="text-xs text-slate-400">{v.famille} — {v.date} à {v.heure}</p>
                </div>
                <Badge
                  label={v.statut}
                  type={v.statut === 'acceptée' ? 'green' : v.statut === 'refusée' ? 'red' : 'gold'}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
