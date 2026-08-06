// src/pages/personnel/DossierResident.jsx
import React, { useState } from 'react';
import { SectionHeader, Modal, FormField } from '../../components/UI';
import { addResidentNote, addResidentMesure, getApiErrorMessage } from '../../config/api';

export default function DossierResident({ residents, setResidents }) {
  const [selectedId, setSelectedId] = useState(null);
  const [tab, setTab] = useState('notes');
  const [noteText, setNoteText] = useState('');
  const [mesureModal, setMesureModal] = useState(false);
  const [mForm, setMForm] = useState({ date: '', tension: '', poids: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const resident = residents.find((r) => r.id === selectedId);

  const addNote = async () => {
    if (!noteText.trim() || !selectedId) return;
    setSaving(true);
    setError('');
    try {
      const updated = await addResidentNote(selectedId, noteText.trim());
      setResidents((prev) => prev.map((r) => (r.id === selectedId ? updated : r)));
      setNoteText('');
    } catch (err) {
      setError(getApiErrorMessage(err, "Erreur lors de l'ajout de la note."));
    } finally {
      setSaving(false);
    }
  };

  const addMesure = async () => {
    if (!selectedId) return;
    setSaving(true);
    setError('');
    try {
      const updated = await addResidentMesure(selectedId, mForm);
      setResidents((prev) => prev.map((r) => (r.id === selectedId ? updated : r)));
      setMesureModal(false);
      setMForm({ date: '', tension: '', poids: '' });
    } catch (err) {
      setError(getApiErrorMessage(err, "Erreur lors de l'enregistrement de la mesure."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <SectionHeader title="Dossier résident" subtitle="Consulter et mettre à jour les dossiers" />

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <div className="sc-card p-4">
          <p className="text-xs font-semibold mb-3" style={{ color: '#c9a84c' }}>Résidents actifs</p>
          <div className="space-y-1">
            {residents.filter((r) => r.statut === 'actif').map((r) => (
              <button
                key={r.id}
                onClick={() => { setSelectedId(r.id); setTab('notes'); setError(''); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                  selectedId === r.id
                    ? 'border text-yellow-400'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
                style={selectedId === r.id ? { background: 'rgba(201,168,76,0.15)', borderColor: 'rgba(201,168,76,0.3)' } : {}}
              >
                {r.nom}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 sc-card p-5">
          {!resident ? (
            <p className="text-slate-500 text-sm">Sélectionnez un résident dans la liste.</p>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                  style={{ background: 'linear-gradient(135deg,#c9a84c,#dfc278)', color: '#0f1f3d' }}
                >
                  {resident.nom.charAt(0)}
                </div>
                <div>
                  <h3 className="text-white font-semibold font-display text-lg leading-tight">{resident.nom}</h3>
                  <p className="text-slate-400 text-xs">{resident.age} ans — Chambre {resident.chambre}</p>
                </div>
              </div>

              <div className="flex gap-2 mb-5">
                {[['notes', 'Notes'], ['mesures', 'Mesures médicales']].map(([t, l]) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      tab === t ? 'btn-gold' : 'btn-outline'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {tab === 'notes' && (
                <div>
                  <div
                    className="rounded-xl p-4 min-h-24 mb-3 text-sm text-slate-300 whitespace-pre-wrap"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {resident.notes || <span className="text-slate-600">Aucune note</span>}
                  </div>
                  <div className="flex gap-2">
                    <input
                      className="sc-input flex-1"
                      placeholder="Ajouter une note..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addNote()}
                    />
                    <button className="btn-gold" onClick={addNote} disabled={saving}>
                      Ajouter
                    </button>
                  </div>
                </div>
              )}

              {tab === 'mesures' && (
                <div>
                  <div className="flex justify-end mb-3">
                    <button className="btn-gold text-sm" onClick={() => setMesureModal(true)}>
                      + Enregistrer mesure
                    </button>
                  </div>
                  {(!resident.mesures || resident.mesures.length === 0) ? (
                    <p className="text-slate-500 text-sm">Aucune mesure enregistrée.</p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-slate-400 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                          <th className="text-left pb-2">Date</th>
                          <th className="text-left pb-2">Tension</th>
                          <th className="text-left pb-2">Poids</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resident.mesures.map((m, i) => (
                          <tr key={i} className="table-row">
                            <td className="py-2 pr-4 text-slate-300">{m.date}</td>
                            <td className="py-2 pr-4 text-slate-300">{m.tension}</td>
                            <td className="py-2 text-slate-300">{m.poids}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {mesureModal && (
        <Modal title="Enregistrer mesure médicale" onClose={() => setMesureModal(false)}>
          <div className="space-y-3">
            <FormField label="Date">
              <input
                type="date"
                className="sc-input"
                value={mForm.date}
                onChange={(e) => setMForm({ ...mForm, date: e.target.value })}
              />
            </FormField>
            <FormField label="Tension artérielle">
              <input
                className="sc-input"
                placeholder="ex: 12/8"
                value={mForm.tension}
                onChange={(e) => setMForm({ ...mForm, tension: e.target.value })}
              />
            </FormField>
            <FormField label="Poids">
              <input
                className="sc-input"
                placeholder="ex: 72 kg"
                value={mForm.poids}
                onChange={(e) => setMForm({ ...mForm, poids: e.target.value })}
              />
            </FormField>
            <div className="flex gap-3 pt-2">
              <button className="btn-gold flex-1" onClick={addMesure} disabled={saving}>
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
              <button className="btn-outline flex-1" onClick={() => setMesureModal(false)}>
                Annuler
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
