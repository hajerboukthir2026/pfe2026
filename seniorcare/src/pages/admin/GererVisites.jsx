// src/pages/admin/GererVisites.jsx
import React, { useState } from 'react';
import { SectionHeader, Badge, Modal, FormField, Table } from '../../components/UI';
import { createVisite, updateVisiteStatut, getApiErrorMessage } from '../../config/api';

const EMPTY_FORM = { famille: '', residentId: '', date: '', heure: '' };

export default function GererVisites({ visites, setVisites, residents }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const actifs = residents.filter((r) => r.statut === 'actif');

  const planifier = async () => {
    setSaving(true);
    setError('');
    try {
      const created = await createVisite({
        famille: form.famille,
        residentId: form.residentId || undefined,
        date: form.date,
        heure: form.heure,
      });
      setVisites((prev) => [created, ...prev]);
      setModal(false);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors de la planification.'));
    } finally {
      setSaving(false);
    }
  };

  const setStatut = async (id, statut) => {
    setError('');
    try {
      const updated = await updateVisiteStatut(id, statut);
      setVisites((prev) => prev.map((v) => (v.id === id ? updated : v)));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors de la mise à jour.'));
    }
  };

  return (
    <div>
      <SectionHeader
        title="Gérer les visites"
        action={
          <button
            className="btn-gold"
            onClick={() => {
              setForm(EMPTY_FORM);
              setError('');
              setModal(true);
            }}
          >
            + Planifier
          </button>
        }
      />

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
          {error}
        </div>
      )}

      <Table headers={['Famille', 'Résident', 'Date', 'Heure', 'Statut', 'Actions']}>
        {visites.length === 0 ? (
          <tr>
            <td colSpan={6} className="p-6 text-center text-slate-500 text-sm">
              Aucune visite.
            </td>
          </tr>
        ) : (
          visites.map((v) => (
            <tr key={v.id} className="table-row">
              <td className="p-4 text-white font-medium">{v.famille}</td>
              <td className="p-4 text-slate-300">{v.resident}</td>
              <td className="p-4 text-slate-300">{v.date}</td>
              <td className="p-4 text-slate-300">{v.heure}</td>
              <td className="p-4">
                <Badge
                  label={v.statut}
                  type={v.statut === 'acceptée' ? 'green' : v.statut === 'refusée' ? 'red' : 'gold'}
                />
              </td>
              <td className="p-4">
                {v.statut === 'en attente' && (
                  <div className="flex gap-2 justify-end">
                    <button className="btn-success" onClick={() => setStatut(v.id, 'acceptée')}>
                      Accepter
                    </button>
                    <button className="btn-danger" onClick={() => setStatut(v.id, 'refusée')}>
                      Refuser
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))
        )}
      </Table>

      {modal && (
        <Modal title="Planifier une visite" onClose={() => setModal(false)}>
          <div className="space-y-3">
            <FormField label="Famille">
              <input
                className="sc-input"
                value={form.famille}
                onChange={(e) => setForm({ ...form, famille: e.target.value })}
              />
            </FormField>
            <FormField label="Résident">
              <select
                className="sc-input"
                value={form.residentId}
                onChange={(e) => setForm({ ...form, residentId: e.target.value })}
              >
                <option value="">Sélectionner…</option>
                {actifs.map((r) => (
                  <option key={r.id} value={r.id}>{r.nom}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Date">
              <input
                type="date"
                className="sc-input"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </FormField>
            <FormField label="Heure">
              <input
                type="time"
                className="sc-input"
                value={form.heure}
                onChange={(e) => setForm({ ...form, heure: e.target.value })}
              />
            </FormField>
            <div className="flex gap-3 pt-2">
              <button className="btn-gold flex-1" onClick={planifier} disabled={saving}>
                {saving ? 'Enregistrement…' : 'Planifier'}
              </button>
              <button className="btn-outline flex-1" onClick={() => setModal(false)}>
                Annuler
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
