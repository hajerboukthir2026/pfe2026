// src/pages/famille/FamillePages.jsx
import React, { useState } from 'react';
import { SectionHeader, Badge, Alert, Table } from '../../components/UI';
import { createVisite, createMessage, getApiErrorMessage } from '../../config/api';

export function DemanderVisite({ setVisites, user, residents }) {
  const [form, setForm] = useState({ residentId: '', date: '', heure: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const actifs = residents.filter((r) => r.statut === 'actif');
  const linkedOnly = user?.residentId
    ? actifs.filter((r) => r.id === user.residentId)
    : actifs;

  const send = async () => {
    if (!form.date || !form.heure) return;
    if (!user?.residentId && !form.residentId) return;

    setSaving(true);
    setError('');
    try {
      const created = await createVisite({
        residentId: form.residentId || user.residentId || undefined,
        date: form.date,
        heure: form.heure,
      });
      setVisites((prev) => [created, ...prev]);
      setSent(true);
      setForm({ residentId: '', date: '', heure: '' });
    } catch (err) {
      setError(getApiErrorMessage(err, "Erreur lors de l'envoi de la demande."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <SectionHeader
        title="Demander une visite"
        subtitle="Soumettez une demande de visite à l'administrateur"
      />
      {sent && (
        <Alert
          message="Demande envoyée. En attente de validation par l'administrateur."
          type="success"
        />
      )}
      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
          {error}
        </div>
      )}
      <div className="sc-card p-6 max-w-md">
        <div className="space-y-4">
          {!user?.residentId && (
            <div>
              <label className="sc-label">Résident</label>
              <select
                className="sc-input"
                value={form.residentId}
                onChange={(e) => setForm({ ...form, residentId: e.target.value })}
              >
                <option value="">Sélectionner…</option>
                {linkedOnly.map((r) => (
                  <option key={r.id} value={r.id}>{r.nom}</option>
                ))}
              </select>
            </div>
          )}
          {user?.residentId && linkedOnly[0] && (
            <p className="text-sm text-slate-300">
              Visite pour : <span className="text-white font-medium">{linkedOnly[0].nom}</span>
            </p>
          )}
          {!user?.residentId && linkedOnly.length === 0 && (
            <p className="text-xs text-amber-400">
              Votre compte n&apos;est pas encore lié à un résident. Contactez l&apos;administrateur.
            </p>
          )}
          <div>
            <label className="sc-label">Date souhaitée</label>
            <input
              type="date"
              className="sc-input"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div>
            <label className="sc-label">Heure souhaitée</label>
            <input
              type="time"
              className="sc-input"
              value={form.heure}
              onChange={(e) => setForm({ ...form, heure: e.target.value })}
            />
          </div>
          <button className="btn-gold w-full" onClick={send} disabled={saving}>
            {saving ? 'Envoi…' : 'Envoyer la demande'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PlanningVisitesFamille({ visites }) {
  return (
    <div>
      <SectionHeader title="Planning des visites" subtitle="Suivi de toutes vos demandes de visite" />
      <Table headers={['Résident', 'Date', 'Heure', 'Statut']}>
        {visites.length === 0 ? (
          <tr>
            <td colSpan={4} className="p-6 text-center text-slate-500 text-sm">
              Aucune demande de visite.
            </td>
          </tr>
        ) : (
          visites.map((v) => (
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
          ))
        )}
      </Table>
    </div>
  );
}

export function EnvoyerMessage({ setMessages, user }) {
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const send = async () => {
    if (!msg.trim()) return;
    setSaving(true);
    setError('');
    try {
      const created = await createMessage(msg);
      setMessages((prev) => [created, ...prev]);
      setMsg('');
      setSent(true);
    } catch (err) {
      setError(getApiErrorMessage(err, "Erreur lors de l'envoi."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <SectionHeader
        title="Envoyer un message"
        subtitle="Contactez l'administrateur de la maison de retraite"
      />
      {sent && <Alert message="Message envoyé à l'administrateur." type="success" />}
      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
          {error}
        </div>
      )}
      <div className="sc-card p-6 max-w-md">
        <label className="sc-label">Votre message</label>
        <textarea
          className="sc-input min-h-32 mb-4 resize-none"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Écrivez votre message..."
        />
        <button className="btn-gold w-full" onClick={send} disabled={saving}>
          {saving ? 'Envoi…' : 'Envoyer'}
        </button>
      </div>
    </div>
  );
}

export function ConsulterNotes({ residents }) {
  const actifs = residents.filter((r) => r.statut === 'actif' && r.notes);
  return (
    <div>
      <SectionHeader
        title="Consulter les notes"
        subtitle="Notes médicales disponibles pour votre proche"
      />
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

export function FicheResident({ residents }) {
  const actifs = residents.filter((r) => r.statut === 'actif');
  return (
    <div>
      <SectionHeader
        title="Fiche résident"
        subtitle="Informations générales de votre proche"
      />
      {actifs.length === 0 ? (
        <p className="text-slate-500 text-sm">
          Aucun résident lié à votre compte. Contactez l&apos;administrateur.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {actifs.map((r) => (
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
              {r.mesures?.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/5">
                  <p className="text-xs mb-2" style={{ color: '#c9a84c' }}>Dernières mesures</p>
                  {r.mesures.slice(-3).map((m, i) => (
                    <p key={i} className="text-xs text-slate-400">
                      {m.date} — Tension {m.tension} — {m.poids}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
