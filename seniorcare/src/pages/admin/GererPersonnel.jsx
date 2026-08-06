// src/pages/admin/GererPersonnel.jsx
import React, { useState } from 'react';
import { SectionHeader, Badge, Modal, FormField, Table } from '../../components/UI';
import {
  createPersonnel,
  updatePersonnel,
  archivePersonnel,
  getApiErrorMessage,
} from '../../config/api';

const EMPTY_FORM = {
  nom: '',
  prenom: '',
  email: '',
  motDePasse: '',
  role: 'personnelPermanent',
  specialite: '',
};

export default function GererPersonnel({ personnel, setPersonnel }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setError('');
    setModal('ajouter');
  };

  const openEdit = (p) => {
    setForm({
      nom: p.nomFamille || p.nom,
      prenom: p.prenom || '',
      email: p.email || '',
      motDePasse: '',
      role: p.role,
      specialite: p.specialite || '',
    });
    setError('');
    setModal({ type: 'modifier', item: p });
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      if (modal === 'ajouter') {
        const created = await createPersonnel(form);
        setPersonnel((prev) => [...prev, created]);
      } else {
        const updated = await updatePersonnel(modal.item.id, {
          nom: form.nom,
          prenom: form.prenom,
          role: form.role,
          specialite: form.specialite,
        });
        setPersonnel((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      }
      setModal(null);
    } catch (err) {
      setError(getApiErrorMessage(err, "Erreur lors de l'enregistrement."));
    } finally {
      setSaving(false);
    }
  };

  const archiver = async (id) => {
    if (!window.confirm('Archiver ce membre du personnel ?')) return;
    setError('');
    try {
      const updated = await archivePersonnel(id);
      setPersonnel((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (err) {
      setError(getApiErrorMessage(err, "Erreur lors de l'archivage."));
    }
  };

  return (
    <div>
      <SectionHeader
        title="Gérer les personnels"
        action={<button className="btn-gold" onClick={openAdd}>+ Ajouter</button>}
      />

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
          {error}
        </div>
      )}

      <Table headers={['Nom', 'Email', 'Rôle', 'Spécialité', 'Statut', 'Actions']}>
        {personnel.length === 0 ? (
          <tr>
            <td colSpan={6} className="p-6 text-center text-slate-500 text-sm">
              Aucun personnel enregistré.
            </td>
          </tr>
        ) : (
          personnel.map((p) => (
            <tr key={p.id} className="table-row">
              <td className="p-4 text-white font-medium">{p.nom}</td>
              <td className="p-4 text-slate-400 text-xs">{p.email}</td>
              <td className="p-4">
                <Badge label={p.role === 'personnelPermanent' ? 'Permanent' : 'Stagiaire'} />
              </td>
              <td className="p-4 text-slate-300">{p.specialite || '—'}</td>
              <td className="p-4">
                <Badge label={p.statut} type={p.statut === 'actif' ? 'green' : 'red'} />
              </td>
              <td className="p-4">
                <div className="flex gap-2 justify-end">
                  <button className="btn-outline text-xs" onClick={() => openEdit(p)}>
                    Modifier
                  </button>
                  {p.statut === 'actif' && (
                    <button className="btn-danger" onClick={() => archiver(p.id)}>
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
          title={modal === 'ajouter' ? 'Ajouter personnel' : 'Modifier personnel'}
          onClose={() => setModal(null)}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Nom">
                <input
                  className="sc-input"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                />
              </FormField>
              <FormField label="Prénom">
                <input
                  className="sc-input"
                  value={form.prenom}
                  onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                />
              </FormField>
            </div>
            {modal === 'ajouter' && (
              <>
                <FormField label="Email">
                  <input
                    type="email"
                    className="sc-input"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </FormField>
                <FormField label="Mot de passe">
                  <input
                    type="password"
                    className="sc-input"
                    placeholder="Min. 6 caractères dont 1 chiffre"
                    value={form.motDePasse}
                    onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
                  />
                </FormField>
              </>
            )}
            <FormField label="Rôle">
              <select
                className="sc-input"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="personnelPermanent">Personnel Permanent</option>
                <option value="stagiaire">Stagiaire</option>
              </select>
            </FormField>
            <FormField label="Spécialité">
              <input
                className="sc-input"
                value={form.specialite}
                onChange={(e) => setForm({ ...form, specialite: e.target.value })}
              />
            </FormField>
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
