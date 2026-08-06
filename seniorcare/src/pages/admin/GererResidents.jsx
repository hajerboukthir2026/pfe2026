// src/pages/admin/GererResidents.jsx
import React, { useState } from 'react';
import { SectionHeader, Badge, Modal, FormField, Table } from '../../components/UI';
import {
  createResident,
  updateResident,
  archiveResident,
  getApiErrorMessage,
} from '../../config/api';

const EMPTY_FORM = { nom: '', age: '', chambre: '', notes: '' };

export default function GererResidents({ residents, setResidents }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setError('');
    setModal('ajouter');
  };

  const openEdit = (r) => {
    setForm({
      nom: r.nom,
      age: String(r.age),
      chambre: r.chambre,
      notes: r.notes || '',
    });
    setError('');
    setModal({ type: 'modifier', item: r });
  };

  const save = async () => {
    setSaving(true);
    setError('');
    const payload = {
      nom: form.nom,
      age: Number(form.age),
      chambre: form.chambre,
      notes: form.notes,
    };

    try {
      if (modal === 'ajouter') {
        const created = await createResident(payload);
        setResidents((prev) => [...prev, created]);
      } else {
        const updated = await updateResident(modal.item.id, payload);
        setResidents((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      }
      setModal(null);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors de l\'enregistrement.'));
    } finally {
      setSaving(false);
    }
  };

  const archiver = async (id) => {
    if (!window.confirm('Archiver ce résident ?')) return;
    setError('');
    try {
      const updated = await archiveResident(id);
      setResidents((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors de l\'archivage.'));
    }
  };

  return (
    <div>
      <SectionHeader
        title="Gérer les résidents"
        action={<button className="btn-gold" onClick={openAdd}>+ Ajouter</button>}
      />

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
          {error}
        </div>
      )}

      <Table headers={['Nom', 'Âge', 'Chambre', 'Statut', 'Actions']}>
        {residents.length === 0 ? (
          <tr>
            <td colSpan={5} className="p-6 text-center text-slate-500 text-sm">
              Aucun résident enregistré.
            </td>
          </tr>
        ) : (
          residents.map((r) => (
            <tr key={r.id} className="table-row">
              <td className="p-4 text-white font-medium">{r.nom}</td>
              <td className="p-4 text-slate-300">{r.age} ans</td>
              <td className="p-4 text-slate-300">{r.chambre}</td>
              <td className="p-4">
                <Badge label={r.statut} type={r.statut === 'actif' ? 'green' : 'red'} />
              </td>
              <td className="p-4">
                <div className="flex gap-2 justify-end">
                  <button className="btn-outline text-xs" onClick={() => openEdit(r)}>
                    Modifier
                  </button>
                  {r.statut === 'actif' && (
                    <button className="btn-danger" onClick={() => archiver(r.id)}>
                      Archiver
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))
        )}
      </Table>

      {modal && (
        <Modal
          title={modal === 'ajouter' ? 'Ajouter un résident' : 'Modifier le résident'}
          onClose={() => setModal(null)}
        >
          <div className="space-y-3">
            {[['nom', 'Nom complet'], ['age', 'Âge'], ['chambre', 'Chambre'], ['notes', 'Notes médicales']].map(([f, l]) => (
              <FormField key={f} label={l}>
                <input
                  className="sc-input"
                  value={form[f]}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                />
              </FormField>
            ))}
            <div className="flex gap-3 pt-2">
              <button className="btn-gold flex-1" onClick={save} disabled={saving}>
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
              <button className="btn-outline flex-1" onClick={() => setModal(null)}>
                Annuler
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
