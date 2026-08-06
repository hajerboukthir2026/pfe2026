// src/pages/admin/Comptes.jsx
import React, { useEffect, useState } from 'react';
import { SectionHeader, Badge, Modal, FormField, Table } from '../../components/UI';
import { ROLES, ROLE_LABELS } from '../../data/initialData';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  fetchResidents,
  getApiErrorMessage,
} from '../../config/api';

const EMPTY_FORM = {
  nom: '',
  prenom: '',
  email: '',
  motDePasse: '',
  role: 'famille',
  telephone: '',
  residentId: '',
};

export default function Comptes() {
  const [comptes, setComptes] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(false);
  const [linkModal, setLinkModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [linkResidentId, setLinkResidentId] = useState('');
  const [saving, setSaving] = useState(false);

  const loadComptes = async () => {
    setError('');
    setLoading(true);
    try {
      const [users, res] = await Promise.all([fetchUsers(), fetchResidents()]);
      setComptes(users);
      setResidents(res.filter((r) => r.statut === 'actif'));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Impossible de charger les comptes.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComptes();
  }, []);

  const residentName = (id) => residents.find((r) => r.id === id)?.nom || '—';

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const created = await createUser({
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        motDePasse: form.motDePasse,
        role: form.role,
        telephone: form.telephone || undefined,
        residentId: form.role === 'famille' && form.residentId ? form.residentId : undefined,
      });
      setComptes((prev) => [created, ...prev]);
      setModal(false);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors de la création du compte.'));
    } finally {
      setSaving(false);
    }
  };

  const toggleActif = async (compte) => {
    setError('');
    try {
      const updated = await updateUser(compte.id, {
        actif: compte.statut !== 'actif',
      });
      setComptes((prev) => prev.map((c) => (c.id === compte.id ? updated : c)));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors de la mise à jour du compte.'));
    }
  };

  const saveLink = async () => {
    if (!linkModal) return;
    setSaving(true);
    setError('');
    try {
      const updated = await updateUser(linkModal.id, {
        residentId: linkResidentId || null,
      });
      setComptes((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setLinkModal(null);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors du lien résident.'));
    } finally {
      setSaving(false);
    }
  };

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer ce compte définitivement ?')) return;
    setError('');
    try {
      await deleteUser(id);
      setComptes((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors de la suppression.'));
    }
  };

  return (
    <div>
      <SectionHeader
        title="Comptes utilisateurs"
        action={
          <button
            className="btn-gold"
            onClick={() => { setForm(EMPTY_FORM); setModal(true); }}
          >
            + Créer
          </button>
        }
      />

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-slate-400 text-sm">Chargement des comptes…</p>
      ) : (
        <Table headers={['Nom', 'Email', 'Rôle', 'Résident lié', 'Statut', 'Actions']}>
          {comptes.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-6 text-center text-slate-500 text-sm">
                Aucun compte pour le moment.
              </td>
            </tr>
          ) : (
            comptes.map((c) => (
              <tr key={c.id} className="table-row">
                <td className="p-4 text-white font-medium">{c.label}</td>
                <td className="p-4 text-slate-400 text-xs">{c.email}</td>
                <td className="p-4">
                  <Badge label={ROLE_LABELS[c.role] || c.role} />
                </td>
                <td className="p-4 text-slate-400 text-xs">
                  {c.role === 'famille' ? residentName(c.residentId) : '—'}
                </td>
                <td className="p-4">
                  <Badge label={c.statut} type={c.statut === 'actif' ? 'green' : 'red'} />
                </td>
                <td className="p-4">
                  <div className="flex gap-2 justify-end flex-wrap">
                    {c.role === 'famille' && (
                      <button
                        className="btn-outline text-xs"
                        onClick={() => {
                          setLinkModal(c);
                          setLinkResidentId(c.residentId || '');
                        }}
                      >
                        Lier résident
                      </button>
                    )}
                    {c.statut === 'inactif' ? (
                      <button className="btn-success" onClick={() => toggleActif(c)}>
                        Activer
                      </button>
                    ) : (
                      <button className="btn-outline text-xs" onClick={() => toggleActif(c)}>
                        Désactiver
                      </button>
                    )}
                    <button className="btn-danger" onClick={() => supprimer(c.id)}>
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </Table>
      )}

      {modal && (
        <Modal title="Créer un compte utilisateur" onClose={() => setModal(false)}>
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
            <FormField label="Email">
              <input
                className="sc-input"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </FormField>
            <FormField label="Téléphone (optionnel)">
              <input
                className="sc-input"
                placeholder="+216 XX XXX XXX"
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
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
            <FormField label="Rôle">
              <select
                className="sc-input"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value, residentId: '' })}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
            </FormField>
            {form.role === 'famille' && (
              <FormField label="Résident lié (optionnel)">
                <select
                  className="sc-input"
                  value={form.residentId}
                  onChange={(e) => setForm({ ...form, residentId: e.target.value })}
                >
                  <option value="">Aucun</option>
                  {residents.map((r) => (
                    <option key={r.id} value={r.id}>{r.nom}</option>
                  ))}
                </select>
              </FormField>
            )}
            <div className="flex gap-3 pt-2">
              <button className="btn-gold flex-1" onClick={save} disabled={saving}>
                {saving ? 'Création…' : 'Créer'}
              </button>
              <button className="btn-outline flex-1" onClick={() => setModal(false)}>
                Annuler
              </button>
            </div>
          </div>
        </Modal>
      )}

      {linkModal && (
        <Modal title={`Lier un résident — ${linkModal.label}`} onClose={() => setLinkModal(null)}>
          <div className="space-y-3">
            <FormField label="Résident">
              <select
                className="sc-input"
                value={linkResidentId}
                onChange={(e) => setLinkResidentId(e.target.value)}
              >
                <option value="">Aucun</option>
                {residents.map((r) => (
                  <option key={r.id} value={r.id}>{r.nom}</option>
                ))}
              </select>
            </FormField>
            <div className="flex gap-3 pt-2">
              <button className="btn-gold flex-1" onClick={saveLink} disabled={saving}>
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
              <button className="btn-outline flex-1" onClick={() => setLinkModal(null)}>
                Annuler
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
