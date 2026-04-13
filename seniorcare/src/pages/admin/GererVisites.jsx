// src/pages/admin/GererVisites.jsx
import React, { useState } from 'react';
import { SectionHeader, Badge, Modal, FormField, Table } from '../../components/UI';

const EMPTY_FORM = { famille: '', resident: '', date: '', heure: '' };

export default function GererVisites({ visites, setVisites }) {
  const [modal, setModal] = useState(false);
  const [form, setForm]   = useState(EMPTY_FORM);

  const planifier = () => {
    setVisites((prev) => [...prev, { id: Date.now(), ...form, statut: 'en attente' }]);
    setModal(false);
  };

  const setStatut = (id, statut) =>
    setVisites((prev) => prev.map((v) => (v.id === id ? { ...v, statut } : v)));

  return (
    <div>
      <SectionHeader
        title="Gérer les visites"
        action={
          <button className="btn-gold" onClick={() => { setForm(EMPTY_FORM); setModal(true); }}>
            + Planifier
          </button>
        }
      />

      <Table headers={['Famille', 'Résident', 'Date', 'Heure', 'Statut', 'Actions']}>
        {visites.map((v) => (
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
                  <button className="btn-success" onClick={() => setStatut(v.id, 'acceptée')}>Accepter</button>
                  <button className="btn-danger"  onClick={() => setStatut(v.id, 'refusée')}>Refuser</button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </Table>

      {modal && (
        <Modal title="Planifier une visite" onClose={() => setModal(false)}>
          <div className="space-y-3">
            <FormField label="Famille">
              <input className="sc-input" value={form.famille} onChange={(e) => setForm({ ...form, famille: e.target.value })} />
            </FormField>
            <FormField label="Résident">
              <input className="sc-input" value={form.resident} onChange={(e) => setForm({ ...form, resident: e.target.value })} />
            </FormField>
            <FormField label="Date">
              <input type="date" className="sc-input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </FormField>
            <FormField label="Heure">
              <input type="time" className="sc-input" value={form.heure} onChange={(e) => setForm({ ...form, heure: e.target.value })} />
            </FormField>
            <div className="flex gap-3 pt-2">
              <button className="btn-gold flex-1" onClick={planifier}>Planifier</button>
              <button className="btn-outline flex-1" onClick={() => setModal(false)}>Annuler</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
