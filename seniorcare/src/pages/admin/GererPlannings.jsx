// src/pages/admin/GererPlannings.jsx
import React, { useState } from 'react';
import { SectionHeader, Badge, Modal, FormField, Table } from '../../components/UI';
import { createPlanning, deletePlanning, getApiErrorMessage } from '../../config/api';

const EMPTY_PP = { type: 'personnel', personnel: '', jour: '', debut: '', fin: '', service: '' };
const EMPTY_STAGE = {
  type: 'stage',
  stagiaire: '',
  debut: '',
  fin: '',
  service: '',
  superviseur: '',
};

export default function GererPlannings({ plannings, setPlannings }) {
  const [tab, setTab] = useState('personnel');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY_PP);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const list = plannings.filter((p) => p.type === tab);

  const openAdd = () => {
    setForm(tab === 'personnel' ? EMPTY_PP : EMPTY_STAGE);
    setError('');
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const created = await createPlanning(form);
      setPlannings((prev) => [created, ...prev]);
      setModal(false);
    } catch (err) {
      setError(getApiErrorMessage(err, "Erreur lors de la création."));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Supprimer ce planning ?')) return;
    setError('');
    try {
      await deletePlanning(id);
      setPlannings((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors de la suppression.'));
    }
  };

  return (
    <div>
      <SectionHeader
        title="Gérer les plannings"
        action={<button className="btn-gold" onClick={openAdd}>+ Ajouter</button>}
      />

      <div className="flex gap-2 mb-5">
        {[
          ['personnel', 'Personnel permanent'],
          ['stage', 'Stages'],
        ].map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm ${tab === t ? 'btn-gold' : 'btn-outline'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
          {error}
        </div>
      )}

      {tab === 'personnel' ? (
        <Table headers={['Personnel', 'Jour', 'Début', 'Fin', 'Service', 'Actions']}>
          {list.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-6 text-center text-slate-500 text-sm">Aucun planning.</td>
            </tr>
          ) : (
            list.map((p) => (
              <tr key={p.id} className="table-row">
                <td className="p-4 text-white font-medium">{p.personnel}</td>
                <td className="p-4 text-slate-300">{p.jour}</td>
                <td className="p-4 text-slate-300">{p.debut}</td>
                <td className="p-4 text-slate-300">{p.fin}</td>
                <td className="p-4"><Badge label={p.service} /></td>
                <td className="p-4 text-right">
                  <button className="btn-danger" onClick={() => remove(p.id)}>Supprimer</button>
                </td>
              </tr>
            ))
          )}
        </Table>
      ) : (
        <Table headers={['Stagiaire', 'Début', 'Fin', 'Service', 'Superviseur', 'Actions']}>
          {list.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-6 text-center text-slate-500 text-sm">Aucun planning.</td>
            </tr>
          ) : (
            list.map((p) => (
              <tr key={p.id} className="table-row">
                <td className="p-4 text-white font-medium">{p.stagiaire}</td>
                <td className="p-4 text-slate-300">{p.debut}</td>
                <td className="p-4 text-slate-300">{p.fin}</td>
                <td className="p-4"><Badge label={p.service} /></td>
                <td className="p-4 text-slate-300">{p.superviseur}</td>
                <td className="p-4 text-right">
                  <button className="btn-danger" onClick={() => remove(p.id)}>Supprimer</button>
                </td>
              </tr>
            ))
          )}
        </Table>
      )}

      {modal && (
        <Modal
          title={tab === 'personnel' ? 'Ajouter planning personnel' : 'Ajouter planning stage'}
          onClose={() => setModal(false)}
        >
          <div className="space-y-3">
            {tab === 'personnel' ? (
              <>
                <FormField label="Personnel">
                  <input
                    className="sc-input"
                    value={form.personnel}
                    onChange={(e) => setForm({ ...form, personnel: e.target.value })}
                  />
                </FormField>
                <FormField label="Jour">
                  <input
                    className="sc-input"
                    placeholder="Lundi"
                    value={form.jour}
                    onChange={(e) => setForm({ ...form, jour: e.target.value })}
                  />
                </FormField>
              </>
            ) : (
              <>
                <FormField label="Stagiaire">
                  <input
                    className="sc-input"
                    value={form.stagiaire}
                    onChange={(e) => setForm({ ...form, stagiaire: e.target.value })}
                  />
                </FormField>
                <FormField label="Superviseur">
                  <input
                    className="sc-input"
                    value={form.superviseur}
                    onChange={(e) => setForm({ ...form, superviseur: e.target.value })}
                  />
                </FormField>
              </>
            )}
            <FormField label={tab === 'personnel' ? 'Heure début' : 'Date début'}>
              <input
                type={tab === 'personnel' ? 'time' : 'date'}
                className="sc-input"
                value={form.debut}
                onChange={(e) => setForm({ ...form, debut: e.target.value })}
              />
            </FormField>
            <FormField label={tab === 'personnel' ? 'Heure fin' : 'Date fin'}>
              <input
                type={tab === 'personnel' ? 'time' : 'date'}
                className="sc-input"
                value={form.fin}
                onChange={(e) => setForm({ ...form, fin: e.target.value })}
              />
            </FormField>
            <FormField label="Service">
              <input
                className="sc-input"
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
              />
            </FormField>
            <div className="flex gap-3 pt-2">
              <button className="btn-gold flex-1" onClick={save} disabled={saving}>
                {saving ? 'Enregistrement…' : 'Enregistrer'}
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
