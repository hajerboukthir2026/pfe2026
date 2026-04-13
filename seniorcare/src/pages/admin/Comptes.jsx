// src/pages/admin/Comptes.jsx
import React, { useState } from 'react';
import { SectionHeader, Badge, Modal, FormField, Table } from '../../components/UI';
import { ROLES } from '../../data/initialData';

const EMPTY_FORM = { nom: '', email: '', role: 'famille' };

export default function Comptes({ comptes, setComptes }) {
  const [modal, setModal] = useState(false);
  const [form, setForm]   = useState(EMPTY_FORM);

  const save = () => {
    setComptes((prev) => [...prev, { id: Date.now(), ...form, statut: 'inactif' }]);
    setModal(false);
  };

  const activer   = (id) => setComptes((prev) => prev.map((c) => (c.id === id ? { ...c, statut: 'actif' } : c)));
  const supprimer = (id) => setComptes((prev) => prev.filter((c) => c.id !== id));

  return (
    <div>
      <SectionHeader
        title="Comptes utilisateurs"
        action={<button className="btn-gold" onClick={() => { setForm(EMPTY_FORM); setModal(true); }}>+ Créer</button>}
      />

      <Table headers={['Nom', 'Email', 'Rôle', 'Statut', 'Actions']}>
        {comptes.map((c) => (
          <tr key={c.id} className="table-row">
            <td className="p-4 text-white font-medium">{c.nom}</td>
            <td className="p-4 text-slate-400 text-xs">{c.email}</td>
            <td className="p-4"><Badge label={c.role} /></td>
            <td className="p-4"><Badge label={c.statut} type={c.statut === 'actif' ? 'green' : 'red'} /></td>
            <td className="p-4">
              <div className="flex gap-2 justify-end">
                {c.statut === 'inactif' && (
                  <button className="btn-success" onClick={() => activer(c.id)}>Activer</button>
                )}
                <button className="btn-danger" onClick={() => supprimer(c.id)}>Supprimer</button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      {modal && (
        <Modal title="Créer un compte utilisateur" onClose={() => setModal(false)}>
          <div className="space-y-3">
            <FormField label="Nom complet">
              <input className="sc-input" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
            </FormField>
            <FormField label="Email">
              <input className="sc-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </FormField>
            <FormField label="Rôle">
              <select className="sc-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </FormField>
            <div className="flex gap-3 pt-2">
              <button className="btn-gold flex-1" onClick={save}>Créer</button>
              <button className="btn-outline flex-1" onClick={() => setModal(false)}>Annuler</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
