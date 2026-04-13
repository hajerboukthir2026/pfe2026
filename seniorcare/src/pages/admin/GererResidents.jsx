// src/pages/admin/GererResidents.jsx
import React, { useState } from 'react';
import { SectionHeader, Badge, Modal, FormField, Table } from '../../components/UI';

const EMPTY_FORM = { nom: '', age: '', chambre: '', notes: '' };

export default function GererResidents({ residents, setResidents }) {
  const [modal, setModal] = useState(null); // null | 'ajouter' | { type:'modifier', item }
  const [form, setForm]   = useState(EMPTY_FORM);

  const openAdd = () => { setForm(EMPTY_FORM); setModal('ajouter'); };
  const openEdit = (r) => { setForm({ nom: r.nom, age: r.age, chambre: r.chambre, notes: r.notes }); setModal({ type: 'modifier', item: r }); };

  const save = () => {
    if (modal === 'ajouter') {
      setResidents((prev) => [...prev, { id: Date.now(), ...form, statut: 'actif', mesures: [] }]);
    } else {
      setResidents((prev) => prev.map((r) => (r.id === modal.item.id ? { ...r, ...form } : r)));
    }
    setModal(null);
  };

  const archiver = (id) => setResidents((prev) => prev.map((r) => (r.id === id ? { ...r, statut: 'archivé' } : r)));

  return (
    <div>
      <SectionHeader
        title="Gérer les résidents"
        action={<button className="btn-gold" onClick={openAdd}>+ Ajouter</button>}
      />

      <Table headers={['Nom', 'Âge', 'Chambre', 'Statut', 'Actions']}>
        {residents.map((r) => (
          <tr key={r.id} className="table-row">
            <td className="p-4 text-white font-medium">{r.nom}</td>
            <td className="p-4 text-slate-300">{r.age} ans</td>
            <td className="p-4 text-slate-300">{r.chambre}</td>
            <td className="p-4"><Badge label={r.statut} type={r.statut === 'actif' ? 'green' : 'red'} /></td>
            <td className="p-4">
              <div className="flex gap-2 justify-end">
                <button className="btn-outline text-xs" onClick={() => openEdit(r)}>Modifier</button>
                {r.statut === 'actif' && (
                  <button className="btn-danger" onClick={() => archiver(r.id)}>Archiver</button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </Table>

      {modal && (
        <Modal
          title={modal === 'ajouter' ? 'Ajouter un résident' : 'Modifier le résident'}
          onClose={() => setModal(null)}
        >
          <div className="space-y-3">
            {[['nom','Nom complet'],['age','Âge'],['chambre','Chambre'],['notes','Notes médicales']].map(([f,l]) => (
              <FormField key={f} label={l}>
                <input className="sc-input" value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
              </FormField>
            ))}
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
