// src/pages/admin/GererPersonnel.jsx
import React, { useState } from 'react';
import { SectionHeader, Badge, Modal, FormField, Table } from '../../components/UI';

const EMPTY_FORM = { nom: '', role: 'personnelPermanent', specialite: '' };

export default function GererPersonnel({ personnel, setPersonnel }) {
  const [modal, setModal] = useState(null);
  const [form, setForm]   = useState(EMPTY_FORM);

  const openAdd  = () => { setForm(EMPTY_FORM); setModal('ajouter'); };
  const openEdit = (p) => { setForm({ nom: p.nom, role: p.role, specialite: p.specialite }); setModal({ type: 'modifier', item: p }); };

  const save = () => {
    if (modal === 'ajouter') {
      setPersonnel((prev) => [...prev, { id: Date.now(), ...form, statut: 'actif' }]);
    } else {
      setPersonnel((prev) => prev.map((p) => (p.id === modal.item.id ? { ...p, ...form } : p)));
    }
    setModal(null);
  };

  const archiver = (id) => setPersonnel((prev) => prev.map((p) => (p.id === id ? { ...p, statut: 'archivé' } : p)));

  return (
    <div>
      <SectionHeader
        title="Gérer les personnels"
        action={<button className="btn-gold" onClick={openAdd}>+ Ajouter</button>}
      />

      <Table headers={['Nom', 'Rôle', 'Spécialité', 'Statut', 'Actions']}>
        {personnel.map((p) => (
          <tr key={p.id} className="table-row">
            <td className="p-4 text-white font-medium">{p.nom}</td>
            <td className="p-4">
              <Badge label={p.role === 'personnelPermanent' ? 'Permanent' : 'Stagiaire'} />
            </td>
            <td className="p-4 text-slate-300">{p.specialite}</td>
            <td className="p-4"><Badge label={p.statut} type={p.statut === 'actif' ? 'green' : 'red'} /></td>
            <td className="p-4">
              <div className="flex gap-2 justify-end">
                <button className="btn-outline text-xs" onClick={() => openEdit(p)}>Modifier</button>
                <button className="btn-danger" onClick={() => archiver(p.id)}>Archiver</button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      {modal && (
        <Modal
          title={modal === 'ajouter' ? 'Ajouter personnel' : 'Modifier personnel'}
          onClose={() => setModal(null)}
        >
          <div className="space-y-3">
            <FormField label="Nom complet">
              <input className="sc-input" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
            </FormField>
            <FormField label="Rôle">
              <select className="sc-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="personnelPermanent">Personnel Permanent</option>
                <option value="stagiaire">Stagiaire</option>
              </select>
            </FormField>
            <FormField label="Spécialité">
              <input className="sc-input" value={form.specialite} onChange={(e) => setForm({ ...form, specialite: e.target.value })} />
            </FormField>
            <div className="flex gap-3 pt-2">
              <button className="btn-gold flex-1" onClick={save}>Enregistrer</button>
              <button className="btn-outline flex-1" onClick={() => setModal(null)}>Annuler</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
