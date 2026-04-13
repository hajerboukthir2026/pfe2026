// src/pages/famille/FamillePages.jsx
import React, { useState } from 'react';
import { SectionHeader, Badge, Alert, Table } from '../../components/UI';

// ── Demander une visite ────────────────────────────────
export function DemanderVisite({ setVisites, user }) {
  const [form, setForm] = useState({ resident: '', date: '', heure: '' });
  const [sent, setSent] = useState(false);

  const send = () => {
    if (!form.resident || !form.date || !form.heure) return;
    setVisites((prev) => [
      ...prev,
      { id: Date.now(), famille: user.label, ...form, statut: 'en attente' },
    ]);
    setSent(true);
    setForm({ resident: '', date: '', heure: '' });
  };

  return (
    <div>
      <SectionHeader title="Demander une visite" subtitle="Soumettez une demande de visite à l'administrateur" />
      {sent && <Alert message="Demande envoyée. En attente de validation par l'administrateur." type="success" />}
      <div className="sc-card p-6 max-w-md">
        <div className="space-y-4">
          <div>
            <label className="sc-label">Nom du résident</label>
            <input className="sc-input" value={form.resident} onChange={(e) => setForm({ ...form, resident: e.target.value })} />
          </div>
          <div>
            <label className="sc-label">Date souhaitée</label>
            <input type="date" className="sc-input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            <label className="sc-label">Heure souhaitée</label>
            <input type="time" className="sc-input" value={form.heure} onChange={(e) => setForm({ ...form, heure: e.target.value })} />
          </div>
          <button className="btn-gold w-full" onClick={send}>Envoyer la demande</button>
        </div>
      </div>
    </div>
  );
}

// ── Planning visites ───────────────────────────────────
export function PlanningVisitesFamille({ visites }) {
  return (
    <div>
      <SectionHeader title="Planning des visites" subtitle="Suivi de toutes vos demandes de visite" />
      <Table headers={['Résident', 'Date', 'Heure', 'Statut']}>
        {visites.map((v) => (
          <tr key={v.id} className="table-row">
            <td className="p-4 text-white font-medium">{v.resident}</td>
            <td className="p-4 text-slate-300">{v.date}</td>
            <td className="p-4 text-slate-300">{v.heure}</td>
            <td className="p-4">
              <Badge
                label={v.statut}
                type={v.statut === 'acceptée' ? 'green' : v.statut === 'refusée' ? 'red' : 'gold'}
              />
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

// ── Envoyer message admin ──────────────────────────────
export function EnvoyerMessage({ setMessages, user }) {
  const [msg, setMsg]   = useState('');
  const [sent, setSent] = useState(false);

  const send = () => {
    if (!msg.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), de: user.label, contenu: msg, date: new Date().toISOString().slice(0, 10), lu: false },
    ]);
    setMsg('');
    setSent(true);
  };

  return (
    <div>
      <SectionHeader title="Envoyer un message" subtitle="Contactez l'administrateur de la maison de retraite" />
      {sent && <Alert message="Message envoyé à l'administrateur." type="success" />}
      <div className="sc-card p-6 max-w-md">
        <label className="sc-label">Votre message</label>
        <textarea
          className="sc-input min-h-32 mb-4 resize-none"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Écrivez votre message..."
        />
        <button className="btn-gold w-full" onClick={send}>Envoyer</button>
      </div>
    </div>
  );
}

// ── Consulter notes ────────────────────────────────────
export function ConsulterNotes({ residents }) {
  const actifs = residents.filter((r) => r.statut === 'actif' && r.notes);
  return (
    <div>
      <SectionHeader title="Consulter les notes" subtitle="Notes médicales disponibles pour les résidents" />
      {actifs.length === 0 ? (
        <p className="text-slate-500 text-sm">Aucune note disponible.</p>
      ) : (
        <div className="space-y-4">
          {actifs.map((r) => (
            <div key={r.id} className="sc-card p-5">
              <p className="font-medium text-sm mb-2" style={{ color: '#c9a84c' }}>{r.nom}</p>
              <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{r.notes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Fiche résident ─────────────────────────────────────
export function FicheResident({ residents }) {
  return (
    <div>
      <SectionHeader title="Fiche résident" subtitle="Informations générales des résidents actifs" />
      <div className="grid md:grid-cols-2 gap-4">
        {residents.filter((r) => r.statut === 'actif').map((r) => (
          <div key={r.id} className="sc-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                style={{ background: 'linear-gradient(135deg,#c9a84c,#dfc278)', color: '#0f1f3d' }}
              >
                {r.nom.charAt(0)}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{r.nom}</p>
                <p className="text-slate-400 text-xs">{r.age} ans — Chambre {r.chambre}</p>
              </div>
              <div className="ml-auto">
                <Badge label={r.statut} type="green" />
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {r.notes || 'Aucune information supplémentaire disponible.'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
